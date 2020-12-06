import React from 'react'

const withAuth = (Component, type = 2) => {
    return () => {
        const isAuth = localStorage.getItem("token")

        const json = localStorage.getItem('user')
        if (json !== null)
            const user = JSON.parse(json)
            const isAccepted = user.MAQUYEN === type
        if (isAuth && isAccepted)
            return <Component />;


        return <Redirect to="/" />;
    };
};

export default withAuth