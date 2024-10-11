function Appbar({ name }) {
    return (
        <div className="h-20 border-b flex items-center justify-center">
            <p className="font-medium text-2xl">Welcome, <span className="font-bold">{name}</span></p>
        </div>
    )
}

export default Appbar;