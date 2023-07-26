<script>
  import { Route, Router } from "svelte-routing";
  import Login from "./lib/pages/Login.svelte";
  import { userStore } from "./lib/stores/user_store";
  import Dashboard from "./lib/pages/Dashboard.svelte";
  import PrivateRoute from "./lib/components/PrivateRoute.svelte";
  import AdminLayout from "./lib/components/AdminLayout.svelte";
  import Logout from "./lib/pages/Logout.svelte";

  userStore.useLocalStorage();
</script>

<main>
  <Router>
    <Route path="/login">
      <Login />
    </Route>

    <Route path="/logout">
      <Logout />
    </Route>

    <PrivateRoute path="/dashboard">
      <AdminLayout>
        <Dashboard />
      </AdminLayout>
    </PrivateRoute>
  </Router>
</main>
