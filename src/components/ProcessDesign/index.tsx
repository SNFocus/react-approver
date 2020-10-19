import React, { useState, FC, useReducer, useRef } from 'react'
import MockData from '../../utils/mock'
import NodeController from '../../utils/NodeController'
import { MinusOutlined, PlusOutlined} from '@ant-design/icons';
import ProTree from './ProTree/index'
import ProConfigPane from './PropConfigPane/index'
import './style.css'

let forceUpdateFn = () => {};
const nodeController = new NodeController()

/**
 * 缩放控制滑块组件
 */
interface SCProps { defaultValue: number, max: number, onChange: (x: number) => void }
const ScaleController: FC<SCProps> = (props) => {
    const defValue = props.defaultValue ?? 100
    const max = props.max ?? 200
    const [percent, setPersent] = useState(defValue)
    const STEP = 5
    const update = (n: number) => {
        setPersent(percent + n)
        props.onChange(percent + n)
    }
    const increase = () => percent < max && update(STEP)
    const decrease = () => percent > 20 && update(-STEP)
    return <div className="scale-controller">
                <MinusOutlined className="scale-btn" onClick={decrease}/>
                <span className="scale-text">{percent}%</span>
                <PlusOutlined className="scale-btn"  onClick={increase}/>
            </div>
}


/**
 * 渲染入口
 */
type Action = keyof NodeController | 'editProps'
const Process: FC = () => {
    //////////////////////////    Props    /////////////////////////////
    const containerEle = useRef(null)
    const [paneVisible, setVisible] = useState(false)
    const [, forceUpdate] = useReducer(v => v + 1, 0 )
    const [activeNodeId, setActiveNodeId] = useState(MockData.nodeId)
    forceUpdateFn = forceUpdate
    //////////////////////////   Methods   /////////////////////////////
    const changeScale = (scale: number) => {
        if (containerEle?.current) {
            (containerEle.current as unknown as HTMLDivElement)
            .style.transform = `scale(${scale / 100})`
        }
    }
    const lanchEvent = function (action: Action, payload: string[]) {
        if (action === 'editProps') {
            setVisible(true)
            setActiveNodeId(payload[0])
        } else {
            const fn = nodeController[action]
            if (typeof fn === 'function') {
                fn.apply(nodeController, payload)
                forceUpdateFn()
            } 
        }
    }
    const handleClose = () => setVisible(false)
    const handleConfirm = (properties: CardProperty) => {
        const activeNode = nodeController.nodeMap.get(activeNodeId) as CardNode
        if (activeNode) {
            Object.assign(activeNode.properties, properties)
        }
        handleClose()
    }

    //////////////////////////     Init     /////////////////////////////
    nodeController.recordProData(MockData)

    //////////////////////////   Entry   /////////////////////////////
    return <section className="pro-container-wrap">
        <ScaleController defaultValue={100} max={200} onChange={changeScale} />
        <div className="pro-container" ref={containerEle} >
            {
                <ProTree startNode={MockData} actionHandler={lanchEvent} />
            }
            <div>
                <div className="end-dot"></div>
                <div>流程结束</div>
            </div>
        </div>
        <ProConfigPane 
            activeNodeId={activeNodeId}
            controller={nodeController}
            visible={paneVisible} 
            onCancel={handleClose} 
            onConfirm={handleConfirm} />
    </section>
}

export default Process