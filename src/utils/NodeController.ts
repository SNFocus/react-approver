import { TEMP_MAP  } from './mock'
import { BaseConverter, jsonCopy } from './index'
import { NODE_TYPE } from '../constant/enum'

export default class NodeController {
    nodeMap = new Map<string, ProcessNode>()
    generateID () {
        const BASE_TIME = new Date('2020-09-09').getTime()
        const NOW = new Date().getTime()
        let id, isDuplicate = false, increment = 0;
        do {
            id = BaseConverter(NOW - BASE_TIME + increment)
            isDuplicate = this.nodeMap.has(id)
            increment += 5
        } while(isDuplicate)
        return id
    }

    isStartNode (node: ProcessNode): node is StartNode  {
        return node.type === NODE_TYPE.START
    }

    isConditionNode  (node: ProcessNode): node is ConditionNode  {
        return node.type === NODE_TYPE.CONDITION
    }

    isRouteNode (node: ProcessNode): node is RouteNode  {
        return node.type === NODE_TYPE.ROUTE
    }

    setNodeId (node:ProcessNode ,prevId?: string, selfId?: string) {
        node.nodeId = selfId || this.generateID()
        // 创建好id之后 立即加入到map缓存中
        this.nodeMap.set(node.nodeId, node) 
        if (prevId && !this.isStartNode(node)) {
            node.prevId = prevId
        }
    }

    createNode (nodeType: NODE_TYPE, prevId?: string) {
        const freshNode = jsonCopy(TEMP_MAP[nodeType])
        this.setNodeId(freshNode, prevId)
        if (this.isRouteNode(freshNode)) {
            freshNode.conditionNodes = Array(2).fill(null).map((t,i) => {
                const con = jsonCopy(TEMP_MAP[NODE_TYPE.CONDITION])
                con.properties.priority = i
                this.setNodeId(con, freshNode.nodeId)
                return con
            })
        }
        return freshNode
    }

    linkNode (prev: ProcessNode, next?: ProChildNode) {
        prev.childNode = next
        if (!next) return
        next.prevId = prev.nodeId
    }

    loopProData (data: ProcessNode, callback: Function) {
        const loop = (node: ProcessNode) => {
            if (!node) return
            if (node.childNode) loop(node.childNode)
            if (node.type === NODE_TYPE.ROUTE && node.conditionNodes) {
                node.conditionNodes.forEach(n => loop(n))
            }
            callback(node)
        }
        loop(data)
    }

    recordProData (node: StartNode) {
        this.loopProData(node, (targetNode: ProcessNode) => {
            if (!this.nodeMap.has(targetNode.nodeId)) {
                // 重要: 检测到同ID的节点直接跳过了
                // 因为目前只有强制刷新组件时重新设置了Data
                // 但是node树引用地址依旧没变,如果后期出现引用错误可以考虑是否问题出在这里
                this.nodeMap.set(targetNode.nodeId, targetNode)
            }
        })
    }

    appendNode (nodeId: string, appendType: NODE_TYPE) {
        const node = this.nodeMap.get(nodeId)
        if (!node) return
        const child = this.createNode(appendType, nodeId) as ProChildNode
        const originChild = node.childNode
        node.childNode = child
        this.linkNode(child, originChild)
    }

    appendCondition (nodeId: string) {
        const route = this.nodeMap.get(nodeId) as RouteNode
        if (!route) return
        const cons = route.conditionNodes
        const condition = this.createNode(NODE_TYPE.CONDITION, route.nodeId)
        const hasDefaultCon = cons[cons.length - 1].properties.isDefault
        const insertIndex =  cons.length - Number(hasDefaultCon)
        cons.splice(insertIndex, 0, condition as ConditionNode)
        this.resetBranchPriority(route)
    }

    resetBranchPriority (route: RouteNode) {
        route.conditionNodes.forEach((c, i) => c.properties.priority = i)
    }

    delBranchFromMap (node: ConditionNode) {
        this.loopProData(node, (target: ProcessNode) => {
            this.nodeMap.delete(target.nodeId)
        })
    }

    deleteNode (nodeId: string) {
        const node = this.nodeMap.get(nodeId)
        if (!node || this.isStartNode(node)) return
        const parent = this.nodeMap.get(node.prevId)
        if (!parent) return
        if (this.isConditionNode(node)) {
            if ((parent as RouteNode).conditionNodes.length > 2) {
                const cons = (parent as RouteNode).conditionNodes
                .filter(t => t.nodeId !== nodeId)
                .map((t, i) => (t.properties.priority = i, t));
                (parent as RouteNode).conditionNodes = cons
                this.delBranchFromMap(node)
            } else {
                this.deleteNode(parent.nodeId);
                (parent as RouteNode).conditionNodes.forEach(this.delBranchFromMap.bind(this))
            }
        } else {
            this.linkNode(parent, node.childNode)
            this.nodeMap.delete(nodeId)
        }
    }

    changePriority(nodeId: string, offset: number): void;
    changePriority (nodeId: string, type: string): void;
    changePriority (nodeId: string, payload: any): void {
        const node = this.nodeMap.get(nodeId) as ConditionNode
        if (!node || node.properties.isDefault) return // 默认分支不能改变优先级
        const parent = this.nodeMap.get(node.prevId) as RouteNode
        if (parent) {
            const cons = parent.conditionNodes
            const idx = node.properties.priority
            let limit, offsetIdx;
            if (typeof payload === 'string') {
                limit = payload === 'increase' ? 0 : cons.length - 1
                if (node.properties.priority === limit) return
                offsetIdx = payload === 'increase' ? idx - 1 : idx + 1
            } else {
                offsetIdx = payload
            }
            if (cons[offsetIdx].properties.isDefault) return // 不能和默认分支交换位置
            cons[idx] = cons[offsetIdx]
            cons[offsetIdx] = node
            this.resetBranchPriority(parent)
        }
    }

    increasePriority (nodeId: string) {
        this.changePriority(nodeId, 'increase')
    }
    
    decreasePriority (nodeId: string) {
        this.changePriority(nodeId, 'decrease')
    }

    setDefaultCon (route: RouteNode) {
        const cons = route.conditionNodes
        const lastCon = cons[cons.length - 1]
        if (lastCon.properties.conditions.length) return
        const hasSetCondition = cons.some(c => c.properties.conditions.length > 0)
        if (hasSetCondition) {
            lastCon.content = '其他条件进入此流程'
            lastCon.properties.isDefault = true
        }
    }
}