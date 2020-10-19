import React, { useState, FC, useRef } from 'react'
import { Input } from 'antd'
import { NODE_TYPE } from '../../../constant/enum';
import { useClickOutSide } from '../../../utils/clickoutside'
import {  CloseOutlined, LeftOutlined, RightOutlined} from '@ant-design/icons';
import './style.css'

const ProCard: FC<{ node: CardNode, actionHandler: Function }> = function ({ node, actionHandler }) {
    const [editTitleMode, setMode] = useState(false)
    const ref = useRef(null)
    const showInput = () => setMode(true)
    const cardClassList = `pro-card ${node.type}`
    const isConditionNode = node.type === NODE_TYPE.CONDITION
    const updateTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
        node.properties.title = e.currentTarget.value
    }
    useClickOutSide(ref, () => setMode(false))
    return <section className={cardClassList}>
        <div className="pro-card__header">
            <Input
                size="small"
                ref={ref}
                defaultValue={node.properties.title}
                style={{ display: editTitleMode ? 'block' : 'none' }}
                onChange={updateTitle} />
            <span
                onClick={showInput}
                style={{ color: isConditionNode ? '#15bc83' : undefined, display: editTitleMode ? 'none' : 'block' }}>
                {node.properties.title}
            </span>
            {
                node.type !== NODE_TYPE.START
                && <CloseOutlined className="close" onClick={() => actionHandler('deleteNode', [node.nodeId])} />
            }
        </div>
        <div className="pro-card__body" onClick={() => actionHandler('editProps', [node.nodeId])}>
            {node.content}
        </div>

        {!isConditionNode &&
            <div style={{ width: "30px", top: '24px', background: 'white' }} className="pro-card__arrow right">
                <RightOutlined />
            </div>
        }

        {isConditionNode &&
            <React.Fragment >
                <div className="pro-card__arrow left" onClick={() => actionHandler('increasePriority', [node.nodeId])}>
                    <LeftOutlined />
                </div>
                <div className="pro-card__arrow right" onClick={() => actionHandler('decreasePriority', [node.nodeId])}>
                    <RightOutlined />
                </div>
            </React.Fragment>
        }
    </section>
}

ProCard.whyDidYouRender = true
export default ProCard