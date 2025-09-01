import Navbar from "../../components/Navbar"
import { useProduct } from "../../contexts/ProductContext"

const Settings = () => {

    const {sidebar} = useProduct()
    return (
        <div className="dashboard-bg">
        <Navbar />
        {sidebar()}
        </div>
    )
}

export default Settings