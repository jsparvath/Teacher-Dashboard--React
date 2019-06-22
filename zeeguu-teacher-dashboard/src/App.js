import { Router } from '@reach/router'
import React, { useEffect, useState } from 'react'
import { getUserDetails } from './api/apiUser'
import './assets/styles/App.scss'
import Nav from './components/Nav'
import TimePeriodContext from './context/TimePeriodContext'
import UserContext from './context/UserContext'
import Classroom from './pages/Classroom'
import Home from './pages/Home'
import NotLoggedInPage from './pages/NotLoggedInPage'
import StudentPage from './pages/StudentPage'
import { useCookie } from './utilities/hooks'
import { useAuthentication } from './utilities/permissions'

const App = () => {
  const [timePeriod, setTimePeriod] = useCookie('timeperiod', 30)

  const { loadingAuth, isAuthenticated } = useAuthentication()
  const [userDetails, setUserDetails] = useState({})

  useEffect(() => {
    getUserDetails().then(details => {
      setUserDetails(details.data)
    })
  }, [])
  return (
    <TimePeriodContext.Provider value={{ timePeriod, setTimePeriod }}>
      <UserContext.Provider value={userDetails}>
        <div className="App">
          {loadingAuth ? null : isAuthenticated ? (
            <div>
              <Nav />
              <Router>
                <Home path={`/${process.env.REACT_APP_ROOT_NAME}`} />
                <Classroom
                  path={`/${
                    process.env.REACT_APP_ROOT_NAME
                  }/classroom/:cohortId`}
                />
                <StudentPage
                  path={`/${
                    process.env.REACT_APP_ROOT_NAME
                  }/student/:studentId`}
                />
              </Router>
            </div>
          ) : (
            <NotLoggedInPage />
          )}
        </div>
      </UserContext.Provider>
    </TimePeriodContext.Provider>
  )
}

export default App
