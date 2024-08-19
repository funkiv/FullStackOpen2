const Notification = ({ message }) => {
    if (message === null) {
      return null
    } else if (message.isGood) {
        return(
            <div className='goodNotification'>
                {message.text}
            </div>
        )
    } else {
        return(
            <div className='badNotification'>
                {message.text}
            </div>
        )
    }
    
}

  export default Notification