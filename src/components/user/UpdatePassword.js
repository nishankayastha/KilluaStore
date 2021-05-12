import React, { Fragment, useState, useEffect } from 'react'

import MetaData from '../layout/MetaData'

import { useAlert } from 'react-alert'
import { useDispatch, useSelector } from 'react-redux'
import { updatePassword, clearErrors } from '../../actions/userActions'
import { UPDATE_PASSWORD_RESET } from '../../constants/userConstants'

const UpdatePassword = ({ history }) => {

    const [passwordFields, setPasswordFields] = useState({
        password:'',
        oldPassword:''
    })

    const alert = useAlert();
    const dispatch = useDispatch();

    const { error, isUpdated, loading } = useSelector(state => state.user)

    useEffect(() => {

        if (error) {
            alert.error(error);
            dispatch(clearErrors());
        }

        if (isUpdated) {
            alert.success('Password updated successfully')

            history.push('/me')

            dispatch({
                type: UPDATE_PASSWORD_RESET
            })
        }

    }, [dispatch, alert, error, history, isUpdated])

    const submitHandler = (e) => {
        e.preventDefault();
        const {oldPassword, password} = passwordFields;
        dispatch(updatePassword({
            password,
            oldPassword
        }))
    }


    const handleInputChange = (e) =>{
        e.preventDefault();
        const {name, value} = e.target;
         setPasswordFields(prevState=> ({
            ...prevState,
            [name] : value
        }))
    }

    return (
        <Fragment>
            <MetaData title={'Change Password'} />

            <div className="row wrapper">
                <div className="col-10 col-lg-5">
                    <form className="shadow-lg" onSubmit={submitHandler}>
                        <h1 className="mt-2 mb-5">Update Password</h1>
                        <div className="form-group">
                            <label htmlFor="oldPassword">oldPassword</label>
                            <input
                                type="password"
                                id="oldPassword"
                                name="oldPassword"
                                className="form-control"
                                value={passwordFields.oldPassword}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password"> Password</label>
                            <input
                                type="password"
                                id="password"
                                className="form-control"
                                name="password"
                                value={passwordFields.password}
                                onChange={handleInputChange}
                            />
                        </div>
                        <button type="submit" className="btn update-btn btn-block mt-4 mb-3" disabled={loading ? true : false} >Update Password</button>
                    </form>
                </div>
            </div>

        </Fragment>
    )
}

export default UpdatePassword
