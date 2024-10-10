function CreditCard() {
    return (
        <div className="relative h-48 w-80 rounded-xl bg-gradient-to-r from-purple-800 
    to-blue-400 text-white shadow-2xl transition-transform sm:h-56 sm:w-96">
            <div className="absolute top-4 w-full px-8 sm:top-8">
                <div className="flex justify-between">
                    <div className="">
                        <p className="font-light">Full Name</p>
                        <p className="font-medium tracking-widest">Pulkit Garg</p>
                    </div>
                    <img className="h-14 w-14 object-contain" src="mastercard.png" />
                </div>
                <div className="pt-1">
                    <p className="font-light">Card Number</p>
                    <p className="tracking-more-wider font-medium">4312 XXX XXXX 7864</p>
                </div>
                <div className="pt-4 pr-6 sm:pt-6">
                    <div className="flex justify-between">
                        <div className="">
                            <p className="text-xs font-light">Valid From</p>
                            <p className="text-base font-medium tracking-widest">10/24</p>
                        </div>
                        <div className="">
                            <p className="text-xs font-light">Expiry</p>
                            <p className="text-base font-medium tracking-widest">10/34</p>
                        </div>

                        <div className="">
                            <p className="text-xs font-light">CVV</p>
                            <p className="tracking-more-wider text-sm font-bold">5XX</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CreditCard
