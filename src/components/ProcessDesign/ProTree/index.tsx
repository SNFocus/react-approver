import React, {CSSProperties, FC } from 'react'
import { Button, Popover} from 'antd'
import { NODE_TYPE } from '../../../constant/enum';
import  { isCardNode } from '../../../utils/mock'
import {  PlusOutlined, TeamOutlined, AuditOutlined, BranchesOutlined } from '@ant-design/icons';
import ProCard from '../ProCard/index'
import './style.css'
const candidateList = [
    {
        type: NODE_TYPE.APPROVER,
        icon: <AuditOutlined />,
        text: '审批人'
    },
    {
        type: NODE_TYPE.CARBON_COPY,
        icon: <TeamOutlined />,
        text: '抄送人'
    },
    {
        type: NODE_TYPE.ROUTE,
        icon: <BranchesOutlined />,
        text: '条件分支'
    }
]
let outHandler:Function = () => {}

function handleCandidateClick(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    const el = event?.currentTarget
    const dataset = el && (el as HTMLDivElement).dataset
    if (dataset?.id && dataset?.type) {
        const {id, type} = dataset
        outHandler('appendNode', [id, type])
    }
}

const renderAppendBtn = function (node: ProcessNode) {
    const content = (<div className="candidate-pane">
        {
            candidateList.map(t => (
                <div className="candidate-item" data-type={t.type} data-id={node.nodeId} onClick={handleCandidateClick} key={t.type}>
                    <div className="candidate-item__icon"> {t.icon} </div>
                    <div className="candidate-item__text"> {t.text} </div>
                </div>
            ))
        }
    </div>)
    return <div className="append-line">
        <Popover content={content} trigger="click" placement="right">
            <Button type="primary" shape="circle" icon={<PlusOutlined />} />
        </Popover>
    </div>
}

const renderNode = function (node: CardNode): JSX.Element[] {
    const NodeElement = <div className="node-wrapper" key={node.nodeId}>
        <ProCard node={node} actionHandler={outHandler} />
        {renderAppendBtn(node)}
    </div>
    const eles = [NodeElement]
    if (node.childNode) {
        return eles.concat(NodeFactory(node.childNode))
    }
    return eles
}

const renderRoute = function (node: RouteNode): JSX.Element[] {
    const buttonStyle = { height: "32px", position: "absolute", transform: "translateY(-50%)", zIndex: 99 } as CSSProperties
    const branchEle = <section className="branch-wrap" key={node.nodeId}>
        <div className="branch">
            <Button style={buttonStyle} shape="round" size="small" onClick={() => outHandler('appendCondition', [node.nodeId])}> 添加条件 </Button>
            {
                node.conditionNodes.map(cnode => (
                    <div className="branch__col" key={'branch__col' + cnode.nodeId}>
                        <div className="branch__centerline"></div>
                        {renderNode(cnode)}
                    </div>
                ))
            }
        </div>
        {renderAppendBtn(node)}
    </section>
    const eles = [branchEle]
    if (node.childNode) {
        return eles.concat(NodeFactory(node.childNode))
    }
    return eles
}

const NodeFactory = (node: ProcessNode) =>
    isCardNode(node)
        ? renderNode(node)
        : renderRoute(node as RouteNode)

const ProTree: FC<{startNode: StartNode, actionHandler: Function}> = function(props) {
    outHandler = props.actionHandler
    return  (<> {NodeFactory(props.startNode)} </>)
}

export default ProTree