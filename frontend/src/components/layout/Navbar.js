import React,{ Fragment } from 'react'
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import propTypes  from 'prop-types';
import {Logout} from '../../actions/auth'

const Navbar = ({auth:{isAuthenticated,loading},Logout}) => {
    const authLinks = (
        <ul>
            <i className="fas fa-sign-out-alt"></i>{' '}
            <li><Link to="/dashboard"><span className='hide-sm'>Dashboard</span></Link></li>
            <li> <a onClick={Logout} href="#!">
              <i className="fas fa-sign-out-alt"></i>{' '}
              <span className='hide-sm'>Logout</span>
            </a></li>    
        </ul>
    );
    const guestLinks = (
        <ul>
            <li><Link to="/profiles">Developers</Link></li>
            <li><Link to="/register">Register</Link></li>
            <li><Link to="/login">Login</Link></li>
        </ul>
    )


    return (
    <nav className="navbar bg-dark">
        <h1>
            <Link to="/"><i className="fas fa-code"></i> DevConnector</Link>
        </h1>
        { !loading && (<Fragment>{isAuthenticated ? authLinks : guestLinks}</Fragment>)}
        
    </nav>
    )
}

Navbar.propTypes = {
    Logout:propTypes.func.isRequired,
    auth:propTypes.object.isRequired
}

const mapStateToProps = state=>({
    auth:state.auth
});


export default connect(mapStateToProps,{Logout})(Navbar)
