import React, { FC, useContext, useState } from "react";
import {Radio, Tabs, Select, Checkbox } from 'antd'
import emitter from '../../../utils/events'
import OrgSelect from "../../FormControl/OrgSelect";
import { OrgNode } from "../../../request";
import { RadioChangeEvent } from "antd/lib/radio";
import {ConfigCtx} from '../PropConfigPane/context';
import { APPROVER_NODE_TEMP } from "../../../utils/mock";
import { overlay, range } from "../../../utils";
const Option = Select.Option
const { TabPane } = Tabs;
const ApproverTypes = [
    {
        label: '指定人员',
        type: 'user'
    },
    {
        label: '主管',
        type: 'director'
    },
    {
        label: '角色',
        type: 'role'
    },
    {
        label: '发起人自己',
        type: 'self'
    },
    {
        label: '发起人自选',
        type: 'optional'
    }
]

///////////////////////    OUTPUT    //////////////////////////
const ApproverConfig: FC = function () {
    const nodeProp = useContext(ConfigCtx)
    overlay(Object.assign({}, APPROVER_NODE_TEMP.properties), nodeProp)
    const [apprType, setApprType] = useState('user')
    const onApprChange = (e: RadioChangeEvent) => {
        emitter.emit('updateProps', 'assigneeType', e.target.value)
        emitter.emit('updateProps', 'approvers', [])
        setApprType(e.target.value)
    }

    return <div className="config-container">
        <Tabs defaultActiveKey="1">
            <TabPane tab={nodeProp.title} key="1"> 
                <div>
                    <div className="config-group">
                        <Radio.Group onChange={onApprChange} defaultValue={nodeProp.assigneeType || 'user'}>
                            {
                                ApproverTypes.map(t => 
                                <Radio 
                                key={t.type}
                                style={{width: '100px', marginBottom: '16px'}}
                                value={t.type}>{t.label}
                                </Radio>)
                            }
                        </Radio.Group>
                        {   apprType === 'user' || apprType === 'role' ?
                            <OrgSelect
                                key={apprType}
                                defaultValue={(nodeProp.approvers || []).map((t: OrgNode) => t['id'])}
                                type={apprType}
                                onChange={(v: OrgNode[]) => emitter.emit('updateProps', 'approvers', v)} 
                                propMap={{
                                valueProp: 'id',
                                keyProp: 'id',
                                titleProp: 'label'
                            }}/> : null
                        }
                        {
                            nodeProp.assigneeType === 'director' &&
                            <div>
                                发起人的 &nbsp;
                                <Select defaultValue={1} className="mb">
                                  {
                                      range(5).map((t,i) => {
                                        return <Option key={i} value={i}>第{i + 1}级主管</Option>
                                      })
                                  }  
                                </Select>
                                <Checkbox defaultChecked={true} ><span className="tip-info">找不到主管时，由上级主管代为审批</span></Checkbox>
                            </div>
                        }
                        {
                            nodeProp.assigneeType === 'self' && <p className="tip-info">发起人自己将作为审批人处理审批单</p>
                        }
                    </div>
                </div>
            </TabPane>
            <TabPane tab="表单权限" key="2"> FFF </TabPane>
        </Tabs>


    </div>
}

ApproverConfig.whyDidYouRender = true
export default ApproverConfig