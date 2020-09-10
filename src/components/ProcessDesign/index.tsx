import React, { useState, FC ,useRef } from 'react'
import { Slider, Input } from 'antd'
import { useClickOutSide } from '../../utils/clickoutside'
import { NODE_TYPE, CardNode, Cards, ProcessNode, RouteNode, isCardNode } from './mock'
import { CloseOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';
import './style.css'


/**
 * 缩放控制滑块
 */
interface SCProps { defaultValue: number, max: number, onChange: (x:number) => void }
const ScaleController: FC<SCProps> = (props) => {
    const defValue = props.defaultValue ?? 100
    const max = props.max ?? 200
    return <Slider 
        max={max} 
        vertical
        defaultValue={defValue} 
        style={{height: '200px', float: "right", marginRight: "16px", zIndex: 999}} 
        onChange={props.onChange} />
}

const RenderCard: FC<{node: CardNode}> =function ({node}) {
    const [editTitleMode, setMode] = useState(false)
    const cardClassList = `pro-card ${node.type}`
    const isConditionNode = node.type === NODE_TYPE.CONDITION
    const showInput = () => setMode(true)
    const updateTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
        node.properties.title = e.currentTarget.value
    }
    const ref = useRef(null)
    useClickOutSide(ref, () =>setMode(false))
    return <section className={cardClassList}>
                <div className="pro-card__header">
                    <Input 
                        size="small" 
                        ref={ref}  
                        defaultValue={node.properties.title} 
                        style={{display: editTitleMode ? 'block': 'none'}}
                        onChange={updateTitle} />
                    <span 
                        onClick={showInput} 
                        style={{color: isConditionNode ? '#15bc83' : undefined,display: editTitleMode ? 'none': 'block'} }>
                        {node.properties.title}
                    </span>
                    <CloseOutlined className="close"/>
                </div>
                <div  className="pro-card__body">
                    {node.content}
                </div>

                {   !isConditionNode && 
                    <div style={{width: "30px", top: '24px', background: 'white'}} className="pro-card__arrow right">
                        <RightOutlined   />
                    </div>
                }
                
                {   isConditionNode &&
                    <React.Fragment >
                        <div className="pro-card__arrow left">
                            <LeftOutlined />
                        </div>
                        <div className="pro-card__arrow right">
                            <RightOutlined />
                        </div>
                    </React.Fragment>
                }
            </section>
}

const renderRoute = function (node: RouteNode) {
    return <div key={node.nodeId}>124</div>
}

const NodeFactory = (node: ProcessNode) => 
      isCardNode(node) ? <RenderCard node={node}  key={node.nodeId}/> : renderRoute(node as RouteNode) 


/**
 * 渲染入口
 */
const Process: FC = () => {
    const [scale, setScale] = useState(100)
    return <section className="pro-container">
        <ScaleController defaultValue={100} max={200} onChange={setScale}/>
        <div style={{transform: `scale(${scale / 100})`}}>
            {
                Cards.map(t => NodeFactory(t)) 
            }
        </div>
    </section>
}

export default Process