import React, {
  FC,
  useRef,
  useState,
  ReactNode,
  MouseEventHandler, useEffect
} from "react";
import "./style.css";
import { ConfigCtx } from './context';
import { jsonCopy } from "../../../utils";
import Emiter from '../../../utils/events';
import ApprConfig from '../ApproverConfig/index';
import { Drawer, Button, Input, Select } from "antd";
import NodeController from "../../../utils/NodeController";
import { useClickOutSide } from "../../../utils/clickoutside";
/* ————————————————————————————————————————————————————————     End Of Import */

//////////////////////////      PropTypes      //////////////////////////////
type ConfigProps = {
  activeNodeId: string;
  visible: boolean;
  onConfirm: Function;
  controller: NodeController;
  onCancel: MouseEventHandler;
};

type TitleProp = {
  prop: CardProperty;
  setTitle: Function;
  appendEle: ReactNode | null;
};

type PrioritySelectProp = {
  max: number;
  priority: number;
  handleChange: (n: number) => void;
};

/////////////////////      TitleInput Components      /////////////////////////
const TitleEditor: FC<TitleProp> = ({ prop, setTitle, appendEle }) => {
  const inputRef = useRef(null);
  const [editMode, setMode] = useState(false);
  const showInput = () => setMode(true);
  useClickOutSide<HTMLInputElement>(inputRef, (el) => {
    setMode(false);
    setTitle(el.value);
  });
  return (
    <div className="config-pane__header">
      <div className="config-pane__title">
        <span style={{ display: editMode ? "none" : "" }} onClick={showInput}>
          {prop.title}
        </span>
        <Input
          style={{ display: editMode ? "" : "none" }}
          ref={inputRef}
          defaultValue={prop.title}
        />
      </div>
      {appendEle}
    </div>
  );
};

const PrioritySelect: FC<PrioritySelectProp> = ({
  priority,
  max,
  handleChange,
}) => {
  const { Option } = Select;
  return (
    <Select
      size="small"
      defaultValue={priority + 1}
      style={{ width: 120 }}
      onChange={handleChange}
    >
      {Array(max)
        .fill(null)
        .map((t, i) => (
          <Option key={"option" + i} value={i + 1}>
            优先级{i + 1}
          </Option>
        ))}
    </Select>
  );
};

const getSelectOfTitle = (
  node: ProcessNode,
  controller: NodeController,
  onChange: (n: number) => void
) => {
  if (!controller.isConditionNode(node)) return null;
  const route = controller.nodeMap.get(node.prevId) as RouteNode;
  const max = route.conditionNodes.length;
  return (
    <PrioritySelect
      max={max}
      priority={node.properties.priority}
      handleChange={onChange}
    />
  );
};

//////////////////////////      OUTPUT      //////////////////////////////
const ProConfigPane: FC<ConfigProps> = function (props) {
  let activeNode = props.controller.nodeMap.get(props.activeNodeId) as CardNode;
  const clonProps = jsonCopy(activeNode.properties);
  const PaneContext = React.createContext({
    setProps (name: string, val: any) {
      (clonProps as any)[name] = val
    }
  })
  const setTitle = (title: string) => (clonProps.title = title);
  const updateProps = () => props.onConfirm(clonProps);
  const onPriorityChange = (priority: number) => {
    (clonProps as ConditionProperty).priority = priority;
  };
  const SelectCmp = getSelectOfTitle(
    activeNode,
    props.controller,
    onPriorityChange
  );
  
  useEffect((() => {
    const handler = (key: string, value: any) => {
      (clonProps as any)[key] = value
    }
    Emiter.on('updateProps', handler)
    return () => {
      Emiter.off('updateProps', handler)
    }
  }))
  return (
    <Drawer
      placement="right"
      width={400}
      closable={false}
      visible={props.visible}
      destroyOnClose={true}
      bodyStyle={{ paddingBottom: 80 }}
      title={
        <TitleEditor
          prop={clonProps}
          setTitle={setTitle}
          appendEle={SelectCmp}
        />
      }
      footer={
        <div style={{ textAlign: "right" }}>
          <Button onClick={props.onCancel} style={{ marginRight: 8 }}>
            Cancel
          </Button>
          <Button onClick={updateProps} type="primary">
            Submit
          </Button>
        </div>
      }
    >
      <ConfigCtx.Provider value={clonProps}>
        <ApprConfig />
      </ConfigCtx.Provider>
    </Drawer>
  );
};

export default ProConfigPane;
