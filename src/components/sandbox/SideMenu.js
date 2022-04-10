import React, {useEffect, useState} from 'react';
import {Layout, Menu} from "antd";
import {UserOutlined} from '@ant-design/icons';
import './index.css';
import {withRouter} from 'react-router-dom';
import axios from 'axios';

const {Sider} = Layout;
const { SubMenu } = Menu
// const  menuList = [
//   {
//     key:"/home",
//     title:"首页",
//     icon:<UserOutlined />
//   },
//   {
//     key:"/user-manage",
//     title:"用户管理",
//     icon:<UserOutlined />,
//     children:[
//       {
//         key:"/user-manage/list",
//         title:"用户列表",
//         icon:<UserOutlined />
//       }
//     ]
//   },
//   {
//     key:"/right-manage",
//     title:"权限管理",
//     icon:<UserOutlined />,
//     children:[
//       {
//         key:"/right-manage/role/list",
//         title:"角色列表",
//         icon:<UserOutlined />
//       },
//       {
//         key:"/right-manage/right/list",
//         title:"权限列表",
//         icon:<UserOutlined />
//       }
//     ]
//   }
// ]
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
        axios.get("http://localhost:5000/rights?_embed=children").then(res => {
            setMenu(res.data);
        })
    }, [])
    const checkPagePermission = (item) => {
        return item.pagepermisson === 1;
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
        <Sider trigger={null} collapsible>
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
export default withRouter(SideMenu)
