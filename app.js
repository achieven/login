import React from 'react'
const $ = require('./node_modules/jquery/dist/jquery.js')
var loginComponent, pageComponent


var LoginComponent = React.createClass({
    getInitialState: function () {
        return {
            username: this.props.username || '',
            password: this.props.password || '',
            loginError: this.props.loginError || ''
        }
    },
    render: function () {
        return (
            <div>
                <script src="./node_modules/bootstrap/dist/js/bootstrap.min.js"></script>
                <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css"/>
                <div id="loginScreen">
                    <div className="container">
                        <div className="row">
                            <div className="col-xs-3"></div>
                            <div className="col-xs-6">
                                <label htmlFor="">Welcome! please sign in</label>
                                <form id="loginForm">
                                    <input type="text" className="form-control" id="username"
                                           value={this.state.username} onChange={this.handleChangeUsername}/>
                                    <input type="password" className="form-control" id="password"
                                           value={this.state.password} onChange={this.handleChangePassword}/>
                                    <button className="btn btn-info">Login</button>
                                </form>
                                <label htmlFor="" id="loginError">{this.state.loginError}</label>
                            </div>
                            <div className="col-xs-3"></div>
                        </div>
                    </div>
                </div>

            </div>
        )
    },
    handleChangeUsername: function (event) {
        this.setState({username: event.target.value});
    },
    handleChangePassword: function (event) {
        this.setState({password: event.target.value});
    },
    getTokenAndRenderPage: function (token) {
        $.ajax({
            type: 'get',
            url: "http://178.62.182.182/page",
            data: {alt: 'json-in-script'},
            beforeSend: function (xhr, settings) {
                xhr.setRequestHeader('Authorization', 'Bearer ' + token);
            },
            success: function (data) {
                $('#loginScreen').addClass('hide')
                $('#pageScreen').removeClass('hide')
                pageComponent.setState({
                    image_url: data.image_url,
                    text: data.text,
                    title: data.title,
                })
                $('#logout').on('click', function (e) {
                    $('#pageScreen').addClass('hide')
                    pageComponent.setState({
                        image_url: '',
                        text: '',
                        title: ''
                    })
                    $('#loginScreen').removeClass('hide')
                })
            }
        });
    },

    componentDidMount: function () {
        if (window.localStorage.getItem('token')) {
            this.getTokenAndRenderPage(window.localStorage.getItem('token'))
        }
        var thisComponent = this, loginComponent = this

        $('#loginForm').unbind('submit').on('submit', function (e) {
            e.preventDefault()
            var data = {
                username: $('#username').val(),
                password: $('#password').val()
            }
            $.ajax({
                type: 'POST',
                url: 'http://178.62.182.182/login',
                contentType: 'application/json',
                data: JSON.stringify(data),
                success: function (tokenObject) {
                    function clearLoginPage() {
                        thisComponent.setState({
                            username: '',
                            password: '',
                            loginError: '',
                        })
                    }

                    clearLoginPage()
                    var token = tokenObject.token
                    window.localStorage.setItem('token', token)

                    thisComponent.getTokenAndRenderPage(token);
                },
                error: function (object, error, reason) {
                    thisComponent.setState({
                        loginError: error + ' ' + reason
                    })
                }
            })
        })
    }
})


var PageComponent = React.createClass({
    getInitialState: function () {
        return {
            image_url: this.props.image_url || '',
            text: this.props.text || '',
            title: this.props.title || ''
        }
    },
    render: function () {
        return (
            <div className="hide" id="pageScreen">
                <div id="pageTitle">
                    {this.state.title}
                </div>
                <div>
                    <img src={this.state.image_url} alt="" id="pageImage"/>

                </div>
                <div id="pageText">
                    {this.state.text}
                </div>
                <button className="btn btn-warning" id="logout">Logout</button>
            </div>
        )
    },
    componentDidMount: function () {
        pageComponent = this
    }
})

var App = React.createClass({
    render: function () {
        return (
            <div>
                <LoginComponent username="" password="" loginError=""> </LoginComponent>
                <PageComponent image_url="" text="" title=""> </PageComponent>
            </div>
        )
    }
})

module.exports = App

