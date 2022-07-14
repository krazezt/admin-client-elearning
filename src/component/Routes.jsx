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
            <Route path="/create-course" component={CreateCourse} />
            <Route path="/category-management" component={CategoryManagement} />
            <Route path={`/edit-course/:id`} component={EditCourse} />
            <Route path="/analytics" component={Analytics} />
            <NotFoud/>
        </Switch>
    )
}


