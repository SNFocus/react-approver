import "./style.css";
import { TreeSelect, Spin, Button } from "antd";
import React, { FC, useCallback, useEffect, useRef, useState } from "react";
import { request, OrgNode } from "../../../request/index";
import { isEmptyArr, jsonCopy, noop, notEmptyArr, overlay } from "../../../utils";

/////////////////        Init        /////////////////////
type OrgType = "dep" | "role" | "user";
type IProps = {
  max?: number;
  defaultValue?: number[];
  onChange?: Function;
  type?: OrgType;
  appearance?: "button" | "input";
  propMap?: {
    valueProp?: string;
    keyProp?: string;
    titleProp?: string;
    childrenProp?: string;
  };
};

type AntTreeNode = {
  key: string;
  value: string;
  title: string;
  checkable?: boolean;
  isLeaf?: boolean;
  selectable?: boolean;
  children?: AntTreeNode[];
};

const defaultPrps: Required<IProps> = {
  max: 10,
  defaultValue: [],
  onChange: noop,
  type: "dep",
  appearance: "button",
  propMap: {
    valueProp: "value",
    keyProp: "key",
    titleProp: "title",
    childrenProp: "children",
  },
};

type TTreeMap = { [key in OrgType]: AntTreeNode[] };
const TreeDataMap: TTreeMap = {
  role: [],
  dep: [],
  user: [],
};

const nodeMap = new Map();

let treeData: AntTreeNode[] = [];

const DefRules = {
  valueProp: "value",
  keyProp: "key",
  titleProp: "title",
  childrenProp: "children",
};

const setNodeProp = (node: any, rules: any): any => {
  if (node) {
    nodeMap.set(node[rules["valueProp"]].toString(), node);
    const children = node[rules["childrenProp"]];
    const hasChildren = notEmptyArr(children);

    let res: AntTreeNode = {
      value: node[rules["valueProp"]].toString(),
      key: node[rules["keyProp"]].toString(),
      title: node[rules["titleProp"]],
      checkable: !hasChildren,
      selectable: !hasChildren,
      isLeaf: !hasChildren,
    };
    if (hasChildren) {
      res.children = children.map((n: AntTreeNode) => setNodeProp(n, rules));
    }
    return res;
  }
  return node;
};

const revokeChange = (nodes: any) => {
  return nodes
    .map(({value}:{value: string}) => nodeMap.get(value))
    .filter(Boolean);
};

///////////////////////     Component     /////////////////////////
const OrgSelect: FC<IProps> = (props) => {
  const [mounted, setMounted] = useState(false);
  const treeRef = useRef<TreeSelect<unknown[]>>(null);
  const options = Object.assign({}, defaultPrps, props);
  const onChange = useCallback(
    (val) => {
      options.onChange && options.onChange(revokeChange(val));
    },
    [options]
  );
  const rules = overlay(jsonCopy(DefRules), options.propMap || {});

  useEffect(() => {
    const type = options.type
    if (type !== undefined && isEmptyArr(TreeDataMap[type])) {
      request(type)
        .then((res: OrgNode[]) => {
          nodeMap.clear();
          TreeDataMap[type] = res.map((n: OrgNode) =>
            setNodeProp(n, rules)
          );
          setMounted(true);
        })
        .catch((err) => console.error(err));
    } else {
      setMounted(true);
    }
  }, [options.type, rules]);

  if (!mounted) {
    return (
      <div>
        <Spin />
      </div>
    );
  } else {
    treeData = TreeDataMap[options.type];
    const tProps = {
      treeData,
      defaultValue: options.defaultValue,
      onChange: onChange,
      treeCheckable: true,
      bordered: options.appearance === "input",
      treeCheckStrictly: true,
      style: {
        width: "100%",
      },
    };
    return (
      <div className="org-select">
        {!tProps.bordered && (
          <Button type="primary" className="select__btn">
            点击添加
          </Button>
        )}
        <TreeSelect ref={treeRef} {...tProps} />
      </div>
    );
  }
};
OrgSelect.whyDidYouRender = true
export default OrgSelect;
