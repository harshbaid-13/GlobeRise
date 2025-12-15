const Backdrop = ({ isOpen, onClick }) => {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
            onClick={onClick}
            aria-hidden="true"
        />
    );
};

export default Backdrop;
