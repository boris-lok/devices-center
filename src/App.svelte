<script>
  import { Route, Router } from "svelte-routing";
  import Login from "./lib/pages/Login.svelte";
  import { userStore } from "./lib/stores/user_store";
  import Dashboard from "./lib/pages/Dashboard.svelte";
  import PrivateRoute from "./lib/components/PrivateRoute.svelte";

  userStore.useLocalStorage();
</script>

<main>
  <Router>
    <Route path="/login">
      <Login />
    </Route>

    <PrivateRoute path="dashboard">
      <Dashboard />
    </PrivateRoute>
  </Router>
</main>
