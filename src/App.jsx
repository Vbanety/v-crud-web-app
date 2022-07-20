import React, { useState, useEffect, useRef } from "react"
import InputMask from 'react-input-mask'
import { firebaseApp } from './firebase'
import {
  getFirestore,
  getDocs,
  collection,
  addDoc,
  doc,
  deleteDoc,
  updateDoc
} from 'firebase/firestore'

export const App = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [city, setCity] = useState('')
  const [users, setUsers] = useState([])
  const [currentUser, setCurrentUser] = useState([])
  const [modal, setModal] = useState(false)
  const [error, setError] = useState(false)
  const [modalSetting, setModalSetting] = useState(false)
  const [message, setMessage] = useState('')
  const [getId, setGetId] = useState('')
  const [getReference, setGetReference] = useState(false)
  const [loading, setLoading] = useState(false)

  const db = getFirestore(firebaseApp)
  const userCollectionRef = collection(db, 'users')


  // REGISTER USER ON MODAL 
  const handleRegisterUser = async () => {
    if (name !== '' && name.length !== 0 && email !== '' && email.length !== 0 && phone !== '' && phone.length !== 0 && city !== '' && city.length !== 0) {
      setLoading(!loading)
      const user = await addDoc(userCollectionRef, {
        name, email, phone, city
      })
      const updateData = await getDocs(userCollectionRef)
      setUsers(updateData.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
      setModal(false)
      setError(false)
      setLoading(loading)
    } else {
      setError(!false)
      setMessage('Is there some empty field..')
    }
  }

  // DELETE USER BY ID INSIDE SETTING MODAL
  const handleDeleteUser = async (id) => {
    confirm('Are you sure to delete this user?')
    const userDoc = doc(db, 'users', id)
    await deleteDoc(userDoc)
    const updateDataDeleted = await getDocs(userCollectionRef)
    setUsers(updateDataDeleted.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
    setModalSetting(false)
  }

  // SHOW LIST DATA
  useEffect(() => {

    const getUsers = async () => {
      const data = await getDocs(userCollectionRef)
      setUsers(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
    }
    getUsers()

  }, [])

  // OPEN MODAL REGISTER AND EDIT
  const handleOpenModal = () => {
    setModal(!modal)
    setGetReference(false)
    clearInputs()
  }

  // CLEAR FIELDS
  const clearInputs = async () => {
    setName('')
    setEmail('')
    setPhone('')
    setCity('')
  }

  // OPEN SETTING MODAL BY ID
  const handleSettingModal = id => {
    setModal(!false)
    const currentUser = users.filter(item => item.id === id)
    setGetReference(!false)
    setCurrentUser(currentUser)
    setModalSetting(false)
    clearInputs()
  }

  // UPDATE USER BY ID INSIDE MODAL EDIT
  const handleUpdateUser = async (idUser) => {
    let n = document.getElementById('nameValue')
    let em = document.getElementById('emailValue')
    let p = document.getElementById('phoneValue')
    let c = document.getElementById('cityValue')
    let name = n.value
    let email = em.value
    let phone = p.value
    let city = c.value

    setLoading(!loading)
    await updateDoc(doc(db, 'users', idUser), {
      name: name,
      email: email,
      phone: phone,
      city: city
    })

    const updateDataEdit = await getDocs(userCollectionRef)
    setUsers(updateDataEdit.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
    setModal(false)
    setLoading(loading)
  }

  const handleFilterTable = () => {
    let getName = document.querySelector('#name')
    let getEmail = document.querySelector('#email')
    let getPhone = document.querySelector('#phone')
    let getCity = document.querySelector('#city')

    if(getName.checked == true) {
      const filterUsersName = async () => {
        const data = await getDocs(userCollectionRef)
        setUsers(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })).sort(function fName(a, b) {
          if(a.name.toUpperCase() < b.name.toUpperCase()) return -1
          if(a.name.toUpperCase() > b.name.toUpperCase()) return 1
        }))  
      }
      filterUsersName()
    }
    if(getEmail.checked == true) {
      const filterUsersEmail = async () => {
        const data = await getDocs(userCollectionRef)
        setUsers(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })).sort(function fEmail(a, b) {
          if(a.email.toLowerCase() < b.email.toLowerCase()) return -1
          if(a.email.toLowerCase() > b.email.toLowerCase()) return 1
        }))  
      }
      filterUsersEmail()
    }
    if(getPhone.checked == true) {
      const filterUsersPhone = async () => {
        const data = await getDocs(userCollectionRef)
        setUsers(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })).sort(function fPhone(a, b) {
          if(a.phone.toLowerCase() < b.phone.toLowerCase()) return -1
          if(a.phone.toLowerCase() > b.phone.toLowerCase()) return 1
        }))  
      }
      filterUsersPhone()
    }
    if(getCity.checked == true) {
      const filterUsersCity = async () => {
        const data = await getDocs(userCollectionRef)
        setUsers(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })).sort(function fCity(a, b) {
          if(a.city.toLowerCase() < b.city.toLowerCase()) return -1
          if(a.city.toLowerCase() > b.city.toLowerCase()) return 1
        }))  
      }
      filterUsersCity()
    }
    

  }
  return (
    <div className="body relative py-4 h-auto">
      <div className="container m-auto p-5 bg-white h-full rounded-2xl shadow-lg">

        <header className="text-center">
          <h1 className="fa-2x text-gray-500 p-2"><i class="fa-solid fa-bars-progress"></i> Crud Web App</h1>
          <div className="flex justify-between flex-col md:flex-row">
            <div className="w-15 ml-0 mr-auto my-auto p-0 text-left uppercase">Order By: </div>
            <div className="flex justify-start w-2/4 ml-0 mr-auto my-auto p-0 text-left flex-col md:flex-row w-fall">
              <div className="my-auto ml-0 mr-auto p-0 text-left">
                <input type="radio" name="radio" id="name" className="mx-2" />
                <label htmlFor="name">Name</label>
              </div>
              <div className="my-auto ml-0 mr-auto p-0 text-left">
                <input type="radio" name="radio" id="email" className="mx-2" />
                <label htmlFor="email">Email</label>
              </div>

              <div className="my-auto ml-0 mr-auto p-0 text-left">
                <input type="radio" name="radio" id="phone" className="mx-2" />
                <label htmlFor="phone">Phone</label>
              </div>

              <div className="my-auto ml-0 mr-auto p-0 text-left">
                <input type="radio" name="radio" id="city" className="mx-2" />
                <label htmlFor="city">City</label>
              </div>

            </div>
              <div className="flex justify-between w-full gap-2 md:w-1/4">
              <button
              onClick={() => handleFilterTable()}
              className="bg-blue-700 hover:bg-blue-700 text-white font-bold mr-auto ml-0  py-2 px-4 rounded w-1/2 md:w-auto"
            >Filter</button>
            <button
              onClick={() => handleOpenModal()}
              className="bg-blue-700 hover:bg-blue-700 text-white font-bold mr-auto ml-0  py-2 px-4 rounded w-1/2 md:w-auto"
            >Register</button>
              </div>
          </div>
        </header>

        <table className="table-fixed w-full bg-white my-10 border-collapse md:table-auto">
          <thead>
            <tr className="text-left bg-indigo-50 text-indigo-500">
              <th className="px-4 overflow-y-auto py-2 w-auto sm:w-1/6">Name</th>
              <th className="px-4 overflow-y-auto py-2 w-auto sm:w-1/6">Email</th>
              <th className="px-4 overflow-y-auto py-2 w-auto sm:w-1/6">Phone</th>
              <th className="px-4 overflow-y-auto py-2 w-auto sm:w-1/6">City</th>
              <th className="px-4 overflow-y-auto py-2 w-auto sm:w-1/6">Setting</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => {
              return (
                <tr key={user.id}>
                  <td className="border px-4 py-2 overflow-y-auto w-1/6 text-gray-400 hover:text-gray-600 snap-x sm:w-auto">{user.name}</td>
                  <td className="border px-4 py-2 overflow-y-auto w-1/6 text-gray-400 hover:text-gray-600 sm:w-auto">{user.email}</td>
                  <td className="border px-4 py-2 overflow-y-auto w-1/6 text-gray-400 hover:text-gray-600 sm:w-auto">{user.phone}</td>
                  <td className="border px-4 py-2 overflow-y-auto w-1/6 text-gray-400 hover:text-gray-600 sm:w-auto">{user.city}</td>
                  <td className="border px-4 py-2 overflow-y-auto w-auto text-gray-400 hover:text-gray-600">
                    <button className="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 m-auto text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" onClick={() => setModalSetting(!false, setGetId(user.id))}>
                      <i className="fa-solid fa-gear"></i>
                    </button>
                  </td>
                </tr>
              )
            })}

          </tbody>
        </table>
      </div>

      {
        modal
        &&
        <div className="modal absolute top-0 left-0 flex justify-center align-middle bg-opacity-0 w-full h-screen" style={{ backgroundColor: 'rgba(0,0,0,.4)' }}>
          <div autoComplete="off" className='box-content m-auto w-96 h-auto rounded  bg-slate-100 p-6 text-center relative translate-y-5 transition duration-500 ease-in-out'>

            <h1 className="h-10 text-2xl font-bold uppercase text-blue-500">{getReference == false ? 'Register Form' : 'Edit Form'}</h1>
            {
              error
              &&
              <div className="w-full h-8 bg-red-400 py-1 px-4 my-2 text-gray-200 mx-auto flex-1 justify-center rounded-md">{message}</div>
            }
            <button
              onClick={() => setModal(false)}
              onChange={() => setGetReference(false)}
              className="absolute top-1 right-3 text-gray-400 hover:text-blue-600"><i className="fa fa-close"
              ></i></button>
            <div className="mb-4 w-90 flex justify-center align-center relative">
              <i className="fa fa-user mx-3.5 my-auto text-xl text-gray-400 hover:text-blue-600"></i>
              
              <input
                autoComplete="off"
                id='nameValue'
                className="shadow py-1 px-4 w-full rounded h-12 text-gray-500 font-bold md:text-left mb-1 md:mb-0 pr-4 outline-none hover:outline-blue-700" htmlFor="inline-full-name"
                type="text"
                placeholder="Name"
                defaultValue={getReference !== true ? '' : currentUser[0].name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="mb-4 w-90 flex justify-center align-center relative">
              <i className="fa fa-envelope mx-3.5 my-auto text-xl text-gray-400 hover:text-blue-600"></i>
              <input
                id="emailValue"
                autoComplete="off"
                className="shadow py-1 px-4 w-full rounded h-12 text-gray-500 font-bold md:text-left mb-1 md:mb-0 pr-4 outline-none hover:outline-blue-700" htmlFor="inline-full-name"
                type="email"
                placeholder="Email"
                defaultValue={getReference !== true ? '' : currentUser[0].email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="mb-4 w-90 flex justify-center align-center">
              <i className="fa fa-phone mx-3.5 my-auto text-xl text-gray-400 hover:text-blue-600"></i>
              <PhoneInput 
                id="phoneValue"
                className="shadow py-1 px-4 w-full rounded h-12 text-gray-500 font-bold md:text-left mb-1 md:mb-0 pr-4 outline-none hover:outline-blue-700" htmlFor="inline-full-name"
                type="text"
                placeholder="Phone"
                defaultValue={getReference !== true ? '' : currentUser[0].phone}
                onChange={(e) => setPhone(e.target.value)}
                autoComplete="off"
              />
              {/* <input
              /> */}
            </div>

            <div className="mb-4 w-90 flex justify-center align-center">
              <i className="fa fa-location-dot mx-3.5 my-auto text-xl text-gray-400 hover:text-blue-600"></i>
              <input
                id="cityValue"
                autoComplete="off"
                className="shadow py-1 px-4 w-full rounded h-12 text-gray-500 font-bold md:text-left mb-1 md:mb-0 pr-4 outline-none hover:outline-blue-700" htmlFor="inline-full-name"
                type="text"
                placeholder="City"
                defaultValue={getReference !== true ? '' : currentUser[0].city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>
            {getReference !== true
              ?
              <button className="bg-blue-700 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={handleRegisterUser}>
                {loading ? <i className="fa-solid fa-spinner spinner_loading"></i> : 'Confirm'}
              </button>
              :
              <button className="bg-blue-700 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => handleUpdateUser(currentUser[0].id)}>     {loading ? <i className="fa-solid fa-spinner spinner_loading"></i> : 'Edit'}
              </button>
            }

          </div>
        </div>
      }
      {
        modalSetting
        &&
        <div className="modal absolute top-0 left-0 flex justify-center align-middle bg-opacity-0 w-full h-screen -z-1" style={{ backgroundColor: 'rgba(0,0,0,.4)' }}>
          <div className='box-content m-auto w-56 h-auto rounded  bg-slate-100 p-6 text-center translate-y-5 transition duration-500 ease-in-out flex justify-center flex-col relative'>
            <i onClick={() => setModalSetting(false)} className="fa fa-close absolute right-3 top-3 text-blue-700 hover:cursor-pointer"></i>
            <h1 className="uppercase mb-5 font-bold text-blue-600">Setting</h1>
            <div className="flex justify-center">
              <button
                className="refEdit block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mx-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                onClick={() => handleSettingModal(getId)}
                defaultValue={getReference}
              >
                <i className="fa-solid fa-edit"></i>
              </button>

              <button
                className="block text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 mx-2 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
                onClick={() => handleDeleteUser(getId)}
              >
                <i className="fa-solid fa-trash"></i>
              </button>
            </div>
          </div>
        </div>
      }
    </div>
  )
}

class PhoneInput extends React.Component {
  render() {
    return <InputMask {...this.props} mask="(99) 9999-9999" maskChar=" " />;
  }
}