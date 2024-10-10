import CreditCard from "./CreditCard"

function Balance({ balance }) {
    return (
        <div className="flex justify-around m-5">
            <div className="flex flex-col justify-center rounded-xl items-center px-20 ml-5 bg-gray-800">
                <div className="text-sm leading-10 font-medium text-gray-400">Total Balance</div>
                <div className="text-white text-5xl"> &#8377; 74,535.00</div>
                <div className="text-sm leading-10 font-medium text-gray-400">Savings Account</div>
            </div>
           
            <CreditCard />
        </div>
    )
}

export default Balance
