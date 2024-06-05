import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import supabase from '../config/supabaseClient';

const getUser = async () => {
  const { data, error } = await supabase.auth.getSession();
  

  if (data) {
    const { data: user, error: userError } = await supabase
      .from('user_roles')
      .select('role_user')
      .eq('user_id', data.session.user.id)
      .single();

    if (user) {
      
      return user;
    } else if (userError) {
      console.log("User not found!");
    }
  }

  if (error) {
    console.log("Please log in correctly!");
  }

  return null;
};

const AdminRoute = ({ element }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const user = await getUser();
      setIsAdmin(user?.role_user === 1);
      setIsLoading(false);
    };

    fetchUser();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return isAdmin ? element : <Navigate to="/login" />;
};

export default AdminRoute;