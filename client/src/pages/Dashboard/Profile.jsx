import { useState } from 'react';
import toast from 'react-hot-toast';
import Sidebar from '../../components/Dashboard/Sidebar';
import Appbar from '../../components/Dashboard/Appbar';
import { useAuthStore } from '../../store/authStore';
import { FaRegEdit } from "react-icons/fa";
import { MdCameraAlt } from "react-icons/md";

const InputField = ({ label, value, onChange, name }) => (
    <div className="flex flex-col">
        <label className="font-medium text-gray-600 dark:text-gray-400">{label}</label>
        <input
            type="text"
            name={name}
            value={value}
            onChange={onChange}
            className="border-b px-3 border-gray-300 focus:outline-none focus:border-blue-500 dark:focus:outline-none dark:border-gray-600 dark:bg-transparent dark:focus:border-blue-400"
        />
    </div>
);

const ReadOnlyField = ({ label, value }) => (
    <div className="flex flex-col">
        <label className="font-medium text-gray-600 dark:text-gray-400">{label}</label>
        <span className="text-black dark:text-gray-200">{value}</span>
    </div>
);

function EditButton({ onEdit }) {
    return (
        <span
            className="absolute top-4 right-4 inline-flex items-center gap-x-1.5 py-1.5 px-3 rounded-full text-xs font-medium bg-blue-100 text-gray-800 dark:bg-blue-800/30 dark:text-gray-100 cursor-pointer"
            onClick={onEdit}
        >
            <FaRegEdit /> Edit
        </span>
    );
}

function Profile() {
    const { user, changeAvatar, updateUser } = useAuthStore();
    const name = `${user.firstName} ${user.lastName}`;
    const defaultAvatar = `https://ui-avatars.com/api/?name=${name}`;

    const [isEditingPersonal, setIsEditingPersonal] = useState(false);
    const [isEditingAddress, setIsEditingAddress] = useState(false);
    const [formData, setFormData] = useState({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone || 'N/A',
        gender: user.gender || 'N/A',
        bio: user.bio || 'N/A',
        country: user.country || 'Not Specified',
        city: user.city || '-',
        postalcode: user.postalcode || '-',
        taxid: user.taxid || '4312 XXX XXXX 7864',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const [image, setImage] = useState(user.avatar || defaultAvatar);
    const [selectedFile, setSelectedFile] = useState(null);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            changeAvatar(file);
        } else {
            console.error("No file selected");
        }
    };

    const uploadImage = async (file) => {
        const formData = new FormData();
        formData.append('image', file);

        try {
            const response = await changeAvatar(formData);
            if (response) {
                setImage(URL.createObjectURL(file));
                toast.success('Image uploaded successfully!');
            }
        } catch (error) {
            toast.error('Failed to upload image');
        }
    };

    const handleSave = async () => {
        try {
            const result = await updateUser(formData);
            if (result) {
                toast.success('Profile updated successfully!');
                setIsEditingPersonal(false);
                setIsEditingAddress(false);
            }
        } catch (error) {
            toast.error(error.message || 'Failed to update profile');
        }
    };

    return (
        <div className="flex dark:bg-gray-900">
            <aside className="w-64 h-screen">
                <Sidebar />
            </aside>

            <div className='flex-1 font-manrope dark:text-white'>
                <Appbar name={name} />
                <h2 className='text-2xl font-bold mx-10 my-6'>My Profile</h2>

                <div className='mx-20'>
                    <div className='px-8 py-4 dark:bg-gray-800 bg-white relative rounded-lg shadow-md'>
                        <EditButton onEdit={() => setIsEditingPersonal(!isEditingPersonal)} />
                        <h3 className='text-xl font-bold m-2'>Personal Information</h3>

                        <div className='flex justify-between items-center mx-8 mt-6'>
                            <div className="shrink-0 group block">
                                <div className="flex items-center">
                                    <div className='relative'>
                                        <img
                                            className="inline-block shrink-0 w-[62px] h-[62px] rounded-full"
                                            src={image}
                                            alt="Avatar"
                                        />
                                        <label className="absolute bottom-0 right-0 cursor-pointer bg-gray-50 rounded-full">
                                            <MdCameraAlt className="w-5 h-5 m-1 text-gray-500" />
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={handleFileChange}
                                            />
                                        </label>
                                    </div>
                                    <div className="ms-5">
                                        <h3 className="font-semibold text-lg text-gray-800 dark:text-white">{name}</h3>
                                        <p className="text-md font-medium text-gray-600 dark:text-neutral-500">{formData.email}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-8 dark:bg-gray-800 bg-white rounded-lg shadow-md">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {isEditingPersonal ? (
                                    <InputField label="First Name" value={formData.firstName} onChange={handleChange} name="firstName" />
                                ) : (
                                    <ReadOnlyField label="First Name" value={formData.firstName} />
                                )}
                                {isEditingPersonal ? (
                                    <InputField label="Last Name" value={formData.lastName} onChange={handleChange} name="lastName" />
                                ) : (
                                    <ReadOnlyField label="Last Name" value={formData.lastName} />
                                )}
                                <ReadOnlyField label="Email" value={formData.email} />
                                {isEditingPersonal ? (
                                    <InputField label="Phone" value={formData.phone} onChange={handleChange} name="phone" />
                                ) : (
                                    <ReadOnlyField label="Phone" value={formData.phone} />
                                )}
                                {isEditingPersonal ? (
                                    <InputField label="Gender" value={formData.gender} onChange={handleChange} name="gender" />
                                ) : (
                                    <ReadOnlyField label="Gender" value={formData.gender} />
                                )}
                                {isEditingPersonal ? (
                                    <div className="flex flex-col">
                                        <label className="font-medium text-gray-600 dark:text-gray-400">Bio</label>
                                        <textarea
                                            name="bio"
                                            value={formData.bio}
                                            onChange={handleChange}
                                            className="border-b px-3 border-gray-300 focus:outline-none focus:border-blue-500 dark:focus:outline-none dark:border-gray-600 dark:bg-transparent dark:focus:border-blue-400 resize-none"
                                        />
                                    </div>
                                ) : (
                                    <ReadOnlyField label="Bio" value={formData.bio} />
                                )}
                            </div>
                            {isEditingPersonal && (
                                <div className="mt-4">
                                    <button onClick={handleSave} className="py-2 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-100 text-blue-800 hover:bg-blue-200 focus:outline-none focus:bg-blue-200 disabled:opacity-50 disabled:pointer-events-none dark:text-blue-300 dark:bg-blue-800/50 dark:hover:bg-blue-800/20 dark:focus:bg-blue-800/20">
                                        Save Changes
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className='mx-20 my-5'>
                    <div className='px-8 py-4 dark:bg-gray-800 bg-white relative rounded-lg shadow-md'>
                        <EditButton onEdit={() => setIsEditingAddress(!isEditingAddress)} />
                        <h3 className='text-xl font-bold m-2'>Address</h3>
                        <div className="px-8 py-4 dark:bg-gray-800 bg-white rounded-lg shadow-md">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {isEditingAddress ? (
                                    <InputField label="Country" value={formData.country} onChange={handleChange} name="country" />
                                ) : (
                                    <ReadOnlyField label="Country" value={formData.country} />
                                )}
                                {isEditingAddress ? (
                                    <InputField label="City / State" value={formData.city} onChange={handleChange} name="city" />
                                ) : (
                                    <ReadOnlyField label="City / State" value={formData.city} />
                                )}
                                {isEditingAddress ? (
                                    <InputField label="Postal Code" value={formData.postalcode} onChange={handleChange} name="postalcode" />
                                ) : (
                                    <ReadOnlyField label="Postal Code" value={formData.postalcode} />
                                )}
                                {isEditingAddress ? (
                                    <InputField label="Tax Id" value={formData.taxid} onChange={handleChange} name="taxid" />
                                ) : (
                                    <ReadOnlyField label="Tax Id" value={formData.taxid} />
                                )}
                            </div>
                            {isEditingAddress && (
                                <div className="mt-4">
                                    <button onClick={handleSave} className="py-2 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-100 text-blue-800 hover:bg-blue-200 focus:outline-none focus:bg-blue-200 disabled:opacity-50 disabled:pointer-events-none dark:text-blue-300 dark:bg-blue-800/50 dark:hover:bg-blue-800/20 dark:focus:bg-blue-800/20">
                                        Save Changes
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;