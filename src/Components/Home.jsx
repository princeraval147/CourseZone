import React from 'react'

const Home = () => {
    return (
        <>
            <div className="homeContainer">
                <div className="homeTxt">
                    <h2 className='homeHeading'>All the skills you need in one place</h2>
                    <p>From critical skills to technical topics, Udemy supports your professional development.</p>
                </div>
                <div>
                    <img
                        className="img"
                        height={350}
                        src="https://media.istockphoto.com/id/637711198/photo/hand-with-marker-writing-skill-concept.jpg?s=612x612&w=0&k=20&c=Dq1KVhcx71mfFq36b8Ieaz-H9IKCdu9YdDSkY_5XfM4="
                        alt="Skills Image"
                    />
                </div>
            </div>

            <div id="About" >
                <p> We are one of the leading prep providers for finance-related courses and we could not make it this far without you! Since our inception, our mission is to help people grow and gain a good trajectory in the finance industry. The journey so far has been thrilling as we have seen people come to us and leave transformed with knowledge and the tools needed for a finance career.</p>
            </div>
        </>
    )
}

export default Home
