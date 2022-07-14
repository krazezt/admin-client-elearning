import React from 'react'
import { Route, Switch } from 'react-router-dom'
import CategoryManagement from '../pages/CategoryManagement'
import CreateCourse from '../pages/CreateCourse'
import Dashboard from '../pages/Dashboard'
import { NotFoud } from '../pages/NotFoud'
import Analytics from '../pages/Analytics'
import EditCourse from '../pages/EditCourse'

export const Routes = () => {
    return (
        <Switch>
            <Route path="/" exact component={Dashboard} />
            <Route path="/users" component={CreateCourse} />
            <Route path="/censorship" component={CategoryManagement} />
            <Route path="/analytics" component={Analytics} />
            <Route path={`/edit-course/:id`} component={EditCourse} />
            <NotFoud/>
        </Switch>
    )
}


