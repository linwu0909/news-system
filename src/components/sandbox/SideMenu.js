import React, {useEffect, useState} from 'react';
import {Layout, Menu} from "antd";
import {UserOutlined} from '@ant-design/icons';
import './index.css';
import {withRouter} from 'react-router-dom';
import axios from 'axios';
import {connect} from "react-redux";

const {Sider} = Layout;
const { SubMenu } = Menu
const iconList = {
    "/home":<UserOutlined />,
    "/user-manage":<UserOutlined />,
    "/user-manage/list":<UserOutlined />,
    "/right-manage":<UserOutlined />,
    "/right-manage/role/list":<UserOutlined />,
    "/right-manage/right/list":<UserOutlined />
    //.......
}
function SideMenu(props) {
    const [menu, setMenu] = useState([]);

    useEffect(() => {
        axios.get("/rights?_embed=children").then(res => {
            setMenu(res.data);
        })
    }, [])

    const {role: {rights}} = JSON.parse(localStorage.getItem("token"))

    const checkPagePermission = (item) => {
        return item.pagepermisson && rights.includes(item.key);
    }

    const renderMenu = (menuList) => {
        return menuList.map(item => {
            if (item.children && item.children.length && checkPagePermission(item)) {
                return <SubMenu key={item.key} icon={iconList[item.key]} title={item.title}>
                    {renderMenu(item.children)}
                </SubMenu>
            }
            return checkPagePermission(item) && <Menu.Item key={item.key} icon={iconList[item.key]} onClick={() => {
                props.history.push(item.key)
            }
            }>{item.title}</Menu.Item>
        })
    }

    const selectKeys = [props.location.pathname];
    const openKeys = ['/'+props.location.pathname.split('/')[1]]

    return (
        <Sider trigger={null} collapsible collapsed={props.isCollapsed}>
            <div style={{display:"flex", height: "100%", "flexDirection": "column"}}>
                <div className="logo">全球新闻发布管理系统</div>
                <div style={{flex: 1, "overflow": "auto"}}>
                    <Menu theme="dark" mode="inline" selectedKeys={selectKeys}
                    defaultOpenKeys={openKeys}>
                        {renderMenu(menu)}
                    </Menu>
                </div>
            </div>
        </Sider>
    )
}

const mapStateToProps = ({CollApsedReducer: {isCollapsed}}) => ({
    isCollapsed
})

export default connect(mapStateToProps)(withRouter(SideMenu))
