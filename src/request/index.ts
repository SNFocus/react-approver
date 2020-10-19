import { jsonCopy, random, sleep } from '../utils/index'
export interface OrgNode {
    key?: number
    pid?: number,
    id: number,
    label: string,
    type: string,
    children?: OrgNode[]
} 

const USERS: OrgNode[] = [
    '无良','李哲','浩名','揽月','房柳',
    '系寻','桥婴','斛吏','仆方','司粼',
    '媪陆'
    ].map((t, i) => ({
    pid: random(0, 4),
    id: i + 20,
    label: t,
    type: 'user'
}))

const DEP:OrgNode[] = ['修仙部', '武侠部', '摸鱼部', '奋斗部'].map((t, i) => ({
    id: i,
    label: t,
    type: 'dep',
    children: USERS.filter(t => t.pid === i)
}))

const ONLY_DEP: OrgNode[] = jsonCopy(DEP).map(t => {
    delete t.children
    return t
})

const ROLE_GROUP: OrgNode[] = ['默认','职务','岗位'].map((t, i) => ({
    label: t,
    id: i + 50,
    type: 'role_group',
}))

const ROLE = [
    ["负责人", "主管", "主管理员", "子管理员"],
    ["财务", "人事", "出纳", "销售", "客服", "质检", "研发", "行政", "设计", "产品"],
    ["普通员工", "经理", "科长", "部长", "总监", "管理层", "高级管理者", "总经理"]
].map((t, i) => {
    const GROUP = ROLE_GROUP[i]
    GROUP.children = t.map((r, j) => ({
        pid: GROUP.id,
        id: GROUP.id * 10 + i* 10 + j,
        label: r,
        type: 'user'
    }))
    return GROUP
})

const ORG_MAP = {
    role: ROLE,
    dep: ONLY_DEP,
    onlyUser: USERS,
    user: DEP
}
type OrgType = keyof typeof ORG_MAP
export function request (type: string) {
    return sleep(500, ORG_MAP[type as OrgType])
}

