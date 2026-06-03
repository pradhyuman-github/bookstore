import { Outlet } from "react-router";
import AdminHeader from "./AdminHeader";
export default function AdminPage() {
    return(
        <div>   
            <AdminHeader />

            <Outlet />
        </div>
    );
}