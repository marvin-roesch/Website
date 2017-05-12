import React, {PureComponent} from "react";
import ProjectType from "./elements/ProjectType";
import globals from "../globals";

class MMDNav extends PureComponent {

    constructor(props) {
        super(props);

    }

    renderLoggedIn() {
        return (
            <div>
                <div className="btn-group" role="group" aria-label="Basic example">
                    <a href="/private-messages">
                        <button type="button" className="btn btn-outline-navbar">
                            <i className="fa fa-envelope" aria-hidden="true"/>
                        </button>
                    </a>
                    <a href="/notifications">
                        <button type="button" className="btn btn-outline-navbar">
                            <i className="fa fa-bell" aria-hidden="true"/>
                        </button>
                    </a>
                    <a href="/account">
                        <button type="button" className="btn btn-outline-navbar">
                            <i className="fa fa-cog" aria-hidden="true"/>
                        </button>
                    </a>
                </div>
                &nbsp;
                &nbsp;
                <a href="/account"><img className="avatar avatar-small"
                                        src="http://placehold.it/400/50B2D6/ffffff"/></a>
            </div>
        )
    }

    renderNotLoggedIn() {
        return (
            <div>
                <div className="btn-group" role="group" aria-label="Basic example">
                    <a href="/login">
                        <button type="button" className="btn btn-outline-navbar">
                            Login <i className="fa fa-envelope" aria-hidden="true"/>
                        </button>
                    </a>
                    <a href="/register">
                        <button type="button" className="btn btn-outline-navbar">
                            Register <i className="fa fa-bell" aria-hidden="true"/>
                        </button>
                    </a>
                </div>
            </div>
        )
    }

    renderUserInfo() {

        let storageSystem = localStorage;
        let refreshToken = storageSystem.getItem("refreshToken");
        let tokenExpire = storageSystem.getItem("tokenExpire");
        let refreshTokenExpire = storageSystem.getItem("refreshExpire");
        if (tokenExpire === null) {
            storageSystem = window.sessionStorage;
            refreshToken = storageSystem.getItem("refreshToken");
            tokenExpire = storageSystem.getItem("tokenExpire");
            refreshTokenExpire = storageSystem.getItem("refreshExpire");
        }
        if (tokenExpire) {
            let currentDate = new Date();
            currentDate = (currentDate.getTime() - currentDate.getMilliseconds()) / 1000;
            if (tokenExpire >= currentDate) {
                return this.renderLoggedIn();
            } else {
                if (refreshTokenExpire >= currentDate) {
                    fetch(globals.endPoint + `/auth/refreshToken`,
                        {
                            method: "POST",
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/x-www-form-urlencoded',
                                'Authorization': 'Bearer ' + refreshToken
                            },
                        })
                        .then(result => result.json())
                        .then(returnData => {
                            if (returnData.status == 200) {
                                storageSystem.setItem('token', returnData.data.token);
                                storageSystem.setItem('tokenExpire', returnData.data.tokenExpire);
                                storageSystem.setItem('refreshToken', returnData.data.refreshToken);
                                storageSystem.setItem('refreshExpire', returnData.data.refreshExpire);
                            } else {
                                storageSystem.removeItem('token');
                                storageSystem.removeItem('tokenExpire');
                                storageSystem.removeItem('refreshToken');
                                storageSystem.removeItem('refreshExpire');
                            }
                        });
                } else {
                    storageSystem.removeItem('token');
                    storageSystem.removeItem('tokenExpire');
                    storageSystem.removeItem('refreshToken');
                    storageSystem.removeItem('refreshExpire');
                }
            }
        }

        return this.renderNotLoggedIn();
    }


    render() {
        return (
            <div>
                <div style={{
                    width: '100%',
                    height: '180px',
                    'backgroundImage': "url('')",
                    'backgroundRepeat': 'no-repeat',
                    'backgroundSize': 'cover'
                }}/>
                <nav className="navbar navbar-toggleable-md navbar-inverse bg-inverse">
                    <button className="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse"
                            data-target="#navbarsExampleDefault" aria-controls="navbarsExampleDefault"
                            aria-expanded="false"
                            aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"/>
                    </button>
                    <a className="navbar-brand" href="/"><img src="/favicon/favicon.ico" style={{width: 50}}/></a>

                    <div className="collapse navbar-collapse" id="navbarsExampleDefault">
                        <ul className="navbar-nav mr-auto">
                            <li className="nav-item active">
                                <a className="nav-link" href="/">Home <span className="sr-only">(current)</span></a>
                            </li>
                            <li className="nav-item dropdown">
                                <a className="nav-link dropdown-toggle" href="http://example.com" id="dropdown01"
                                   data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Projects</a>
                                <ProjectType/>
                            </li>
                        </ul>
                        <form className="form-inline my-2 my-lg-0" action="/search">
                            <input className="form-control mr-sm-2" type="text" name="search" placeholder="Search..."/>
                            <button className="btn btn-outline-navbar my-2 my-sm-0" type="submit"><i
                                className="fa fa-search" aria-hidden="true"/></button>
                        </form>
                        &nbsp;&nbsp;&nbsp;
                        {this.renderUserInfo()}
                    </div>
                </nav>
                <br/>
            </div>
        )
    }
}

export default MMDNav;