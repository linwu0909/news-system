import React from 'react';
import {Avatar, Dropdown, Menu, Layout} from "antd";
import {
    MenuUnfoldOutlined,
    MenuFoldOutlined, UserOutlined
} from '@ant-design/icons';
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";

const {Header} = Layout;

function TopHeader(props) {
    const changeCollapsed = () => {
        props.changeCollapsed();
    }

    const {role: {roleName}, username} = JSON.parse(localStorage.getItem("token"));

    const logout= () => {
            localStorage.removeItem("token");
            props.history.replace("/login")
        }

    const menu = (
        <Menu>
            <Menu.Item>
                {roleName}
            </Menu.Item>
            <Menu.Item danger onClick={logout}>退出</Menu.Item>
        </Menu>
    );

    return (
        <Header className="site-layout-background" style={{padding: '0 16px'}}>
            {
                props.isCollapsed?<MenuUnfoldOutlined onClick={changeCollapsed}/>:<MenuFoldOutlined onClick={changeCollapsed}/>
            }
           <div style={{float: "right"}}>
               <span>{username},欢迎回来</span>
               <Dropdown overlay={menu}>
                   <Avatar size="large" icon={<UserOutlined/>}/>
               </Dropdown>
           </div>
        </Header>
    )
}

const mapStateToProps = ({CollApsedReducer: {isCollapsed}}) => {
    return {
        isCollapsed
    }
}

const mapDispatchToProps = {
    changeCollapsed() {
        return {
            type: 'change_collapsed'
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(TopHeader))
