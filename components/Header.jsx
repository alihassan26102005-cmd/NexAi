import React from 'react'

const Header = ({firstName,age,setCount,count}) => {
  return (
    <div>
      Hi! {firstName}
      This is Header Component
      age is {age}

       <button onClick={() => setCount(count +1)}>Header Increament</button>
    </div>
  )
}

export default Header
