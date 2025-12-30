function RecipientSkeleton() {
    return (
        <div className="flex items-center gap-x-[10px] bg-neutral-100 p-3 mt-2 rounded-[4px] dark:bg-gray-700 animate-pulse">
            <div className="rounded-full bg-slate-300 h-14 w-14 dark:bg-slate-600"></div>
            <div className="flex-1 space-y-2">
                <div className="h-4 bg-slate-300 rounded dark:bg-slate-600 w-3/4"></div>
                <div className="h-3 bg-slate-300 rounded dark:bg-slate-600 w-1/2"></div>
                <div className="h-3 bg-slate-300 rounded dark:bg-slate-600 w-2/3"></div>
            </div>
        </div>
    );
}

export default RecipientSkeleton;
