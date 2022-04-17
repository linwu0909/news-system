import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {Table, Button, Modal, Tree} from "antd";
import {DeleteOutlined, EditOutlined, ExclamationCircleOutlined} from "@ant-design/icons";
const {confirm} = Modal;
export default function RoleList() {
    const [dataSource, setDataSource] = useState([]);
    const [rightList, setRightList] = useState([])
    const [currentRights, setCurrentRights] = useState([]);
    const [currentId, setCurrentId] = useState(0);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            render: (id) => {
                return <b>{id}</b>
            }
        },
        {
            title: '角色名称',
            dataIndex: 'roleName'
        },
        {
            title: '操作',
            render: (item) => {
                return <div>
                    <Button danger shape="circle" icon={<DeleteOutlined/>}  onClick={() => confirmMethod(item)}/>
                    <Button type="primary" shape="circle" icon={<EditOutlined/>} onClick={() => {
                        setIsModalVisible(true)
                        setCurrentRights(item.rights)
                        setCurrentId(item.id)
                    }
                    }/>
                </div>
            }
        }
    ]
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
        setDataSource(dataSource.filter(data => data.id !== item.id))
        axios.delete(`/roles/${item.id}`)
    }
    useEffect(() => {
        axios.get('/roles').then(res => {
            setDataSource(res.data);
        })
    },[])
    useEffect(() => {
        axios.get('/rights?_embed=children').then(res=> {
            setRightList(res.data);
        })
    },[])
    const handleOk = () => {
        setIsModalVisible(false);
        setDataSource(dataSource.map(item => {
            if (item.id === currentId) {
                return {
                    ...item,
                    rights: currentRights
                }
            }
            return item;
        }))
        axios.patch(`/roles/${currentId}`, {
            rights: currentRights
        })
    }
    const handleCancel = () => {
        setIsModalVisible(false);
    }
    const onCheck = (checkKeys)=>{
        // console.log(checkKeys)
        setCurrentRights(checkKeys.checked)
    }
    return (<div>
        <Table dataSource={dataSource} columns={columns} pagination={{pageSize: 5}} rowKey={(item) => item.id}/>
        <Modal title="权限分配" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
            <Tree                 checkable
                                  checkedKeys = {currentRights}
                                  onCheck={onCheck}
                                  checkStrictly = {true}
                                  treeData={rightList}/>
        </Modal>
    </div>)
}
