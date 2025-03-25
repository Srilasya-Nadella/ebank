import {useState} from 'react'
import {Switch, Route, Redirect, useHistory} from 'react-router-dom'
import Cookies from 'js-cookie'
import './App.css'

const App = () => {
  const history = useHistory()
  const Login = () => {
    const [userId, setUserId] = useState('')
    const [pin, setPin] = useState('')
    const [errorMsg, setErrorMsg] = useState('')

    const onSubmitForm = async event => {
      event.preventDefault()
      setErrorMsg('') 
      if (!userId) {
        setErrorMsg('Invalid user ID')
        return
      }
      if (!pin) {
        setErrorMsg('Invalid PIN')
        return
      }
      const userDetails = {user_id: parseInt(userId), pin} 
      const url = 'https://apis.ccbp.in/ebank/login'
      const options = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(userDetails),
      }

      try {
        const response = await fetch(url, options)
        const data = await response.json()

        if (response.ok) {

          Cookies.set('jwt_token', data.jwt_token, {expires: 30})
          history.replace('/')
        } else {

          setErrorMsg(data.error_msg)
        }
      } catch (error) {
        setErrorMsg('Something went wrong. Please try again.')
      }
    }

    return (
      <div className="login-container">
        <div className="card">
          <img
            src="https://assets.ccbp.in/frontend/react-js/ebank-logo-img.png"
            alt="website logo"
            className="logo"
          />
          <form onSubmit={onSubmitForm}>
            <h1>Welcome Back</h1>
            <div className="input-container">
              <label htmlFor="userId">USER ID</label>
              <input
                type="text"
                id="userId"
                value={userId}
                onChange={e => setUserId(e.target.value)}
                placeholder="Enter User ID"
              />
            </div>
            <div className="input-container">
              <label htmlFor="pin">PIN</label>
              <input
                type="password"
                id="pin"
                value={pin}
                onChange={e => setPin(e.target.value)}
                placeholder="Enter PIN"
              />
            </div>
            <button type="submit" className="login-button">
              Login
            </button>
            {errorMsg && <p className="error-message">{errorMsg}</p>}
          </form>
          <img
            src="https://assets.ccbp.in/frontend/react-js/ebank-login-img.png"
            alt="website login"
            className="login-image"
          />
        </div>
      </div>
    )
  }

  // Home Component
  const Home = () => {
    const onClickLogout = () => {
      Cookies.remove('jwt_token')
      history.replace('/ebank/login')
    }

    return (
      <div className="home-container">
        <div className="header">
          <img
            src="https://assets.ccbp.in/frontend/react-js/ebank-logo-img.png"
            alt="website logo"
            className="logo"
          />
          <button
            type="button"
            onClick={onClickLogout}
            className="logout-button"
          >
            Logout
          </button>
        </div>
        <h1 role="heading">Your Flexibility, Our Excellence</h1>
        <img
          src="https://assets.ccbp.in/frontend/react-js/ebank-digital-card-img.png"
          alt="digital card"
          className="digital-card"
        />
      </div>
    )
  }

  // NotFound Component
  const NotFound = () => (
    <div className="not-found-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/ebank-not-found-img.png"
        alt="not found"
        className="not-found-img"
      />
      <h1>Page Not Found</h1>
      <p>We are sorry, the page you requested could not be found</p>
    </div>
  )

  // Protected Route
  const ProtectedRoute = ({component: Component, ...rest}) => (
    <Route
      {...rest}
      render={props =>
        Cookies.get('jwt_token') ? (
          <Component {...props} />
        ) : (
          <Redirect to="/ebank/login" />
        )
      }
    />
  )

  return (
    <Switch>
      <Route exact path="/ebank/login" component={Login} />
      <ProtectedRoute exact path="/" component={Home} />
      <Route component={NotFound} />
    </Switch>
  )
}

export default App
