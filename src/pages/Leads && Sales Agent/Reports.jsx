import Navbar from "../../components/Navbar"
import { useProduct } from "../../contexts/ProductContext"

const Reports = () => {

    const {sidebar} = useProduct()
    return (
        <div className="dashboard-bg">
        <Navbar />
        {sidebar()}
        </div>
    )
}

export default Reports