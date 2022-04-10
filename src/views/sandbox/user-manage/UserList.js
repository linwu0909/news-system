import React, {useEffect, useRef, useState} from 'react';
import axios from "axios";
import {Button, Modal, Switch, Table} from "antd";
import {DeleteOutlined, EditOutlined, ExclamationCircleOutlined} from "@ant-design/icons";
import UserForm from "../../../components/user-manage/UserForm";
const {confirm} = Modal;
export default function UserList() {
    const [dataSource, setDataSource] = useState([]);
    const [isAddVisible, setIsAddVisible] = useState(false)
    const [isUpdateVisible, setIsUpdateVisible] = useState(false);
    const [roleList, setRoleList] = useState([]);
    const [regionList, setRegionList] = useState([])
    const [current, setcurrent] = useState(null)

    const [isUpdateDisabled, setIsUpdateDisabled] = useState(false);
    const addForm = useRef(null);
    const updateForm = useRef(null);

    useEffect(() => {
        axios.get('http://localhost:5000/users?_expand=role').then(res => {
            const list = res.data;
            setDataSource(list)
        })
    },[])

    useEffect(() => {
        axios.get('http://localhost:5000/regions').then(res => {
            const list = res.data;
            setRegionList(list)
        })
    },[])

    useEffect(() => {
        axios.get('http://localhost:5000/roles').then(res => {
            const list = res.data;
            setRoleList(list)
        })
    },[])

    const columns = [
        {
            title: '区域',
            dataIndex: 'region',
            filters: [
                ...regionList.map(item=>({
                    text:item.title,
                    value:item.value
                })),
                {
                    text:"全球",
                    value:"全球"
                }

            ],

            onFilter:(value,item)=>{
                if(value==="全球"){
                    return item.region===""
                }
                return item.region===value
            },
            render: (region) => {
                return <b>{region === "" ? '全球' : region}</b>
            }
        },
        {
            title: '角色名称',
            dataIndex: 'role',
            render: (role) => {
                return role?.roleName
            }
        },
        {
            title: "用户名",
            dataIndex: 'username'
        },
        {
            title: "用户状态",
            dataIndex: 'roleState',
            render: (roleState, item) => {
                return <Switch checked={roleState} disabled={item.default} onChange={()=>handleChange(item)}/>
            }
        },
        {
            title: "操作",
            render: (item) => {
                return <div>
                    <Button danger shape="circle" icon={<DeleteOutlined />} onClick={() => confirmMethod(item)} disabled={item.default} />

                    <Button type="primary" shape="circle" icon={<EditOutlined />} disabled={item.default} onClick={()=>handleUpdate(item)}/>
                </div>
            }
        }
    ]

    const handleUpdate = (item)=>{
        setTimeout(()=>{
            setIsUpdateVisible(true)
            if(item.roleId===1){
                //禁用
                setIsUpdateDisabled(true)
            }else{
                //取消禁用
                setIsUpdateDisabled(false)
            }
            updateForm.current.setFieldsValue(item)
        },0)

        setcurrent(item)
    }

    const handleChange = (item) => {
        item.roleState = !item.roleState;
        setDataSource([...dataSource])
        axios.patch(`http://localhost:5000/users/${item.id}`, {
            roleState: item.roleState
        })
    }

    const confirmMethod = (item) => {
        confirm({
            title: '你确定要删除',
            icon: <ExclamationCircleOutlined/>,
            onOk() {
                deleteMethod(item)
            },
            onCancel() {}
        })
    }
    const deleteMethod = (item) => {
        setDataSource(dataSource.filter(data=>data.id!==item.id))
        axios.delete(`http://localhost:5000/users/${item.id}`)
    }
    const addFormOk = () => {
        addForm.current.validateFields().then(value => {
            // console.log(value)

            setIsAddVisible(false)

            addForm.current.resetFields()
            //post到后端，生成id，再设置 datasource, 方便后面的删除和更新
            axios.post(`http://localhost:5000/users`, {
                ...value,
                "roleState": true,
                "default": false,
            }).then(res=>{
                console.log(res.data)
                setDataSource([...dataSource,{
                    ...res.data,
                    role:roleList.filter(item=>item.id===value.roleId)[0]
                }])
            })
        }).catch(err => {
            console.log(err)
        })
    }

    const  updateFormOk = ()=>{
        updateForm.current.validateFields().then(value => {
            // console.log(value)
            setIsUpdateVisible(false)

            setDataSource(dataSource.map(item=>{
                if(item.id===current.id){
                    return {
                        ...item,
                        ...value,
                        role:roleList.filter(data=>data.id===value.roleId)[0]
                    }
                }
                return item
            }))
            setIsUpdateDisabled(!isUpdateDisabled)

            axios.patch(`http://localhost:5000/users/${current.id}`,value)
        })
    }

    return (
        <div>
            <Button type="primary" onClick={() => {
                setIsAddVisible(true)
            }}>添加用户</Button>
            <Table dataSource={dataSource} columns={columns} pagination={{pageSize: 5}}
            rowKey={item=>item.id}/>
            <Modal
                visible={isAddVisible}
                title="添加用户"
                okText="确定"
                cancelText="取消"
                onCancel={() => {
                    setIsAddVisible(false)
                }}
                onOk={() => {
                    addFormOk();
                }}
            >
                <UserForm roleList={roleList} regionList={regionList} ref={addForm}/>
            </Modal>

            <Modal
                visible={isUpdateVisible}
                title="更新用户"
                okText="确定"
                cancelText="取消"
                onCancel={() => {
                    setIsUpdateVisible(false)
                    setIsUpdateDisabled(!isUpdateDisabled)
                }}
                onOk={() => {
                    updateFormOk();
                }}
            >
                <UserForm roleList={roleList} regionList={regionList} ref={updateForm}
                isUpdateDisabled={isUpdateDisabled} isUpdate={true}/>
            </Modal>
        </div>
    )
}
