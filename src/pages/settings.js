import React from 'react';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useGlobalContext } from '@/context/GlobalContext';

const profileSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, { message: "Invalid phone number." }).optional(),
  company: z.string().optional(),
});

const settingsSchema = z.object({
  emailNotifications: z.boolean(),
  darkMode: z.boolean(),
});

export default function Settings() {
  const { data: session } = useSession();
  const { state, dispatch } = useGlobalContext();

  const profileForm = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: session?.user?.name || '',
      email: session?.user?.email || '',
      phone: state.user?.phone || '',
      company: state.user?.company || '',
    },
  });

  const settingsForm = useForm({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      emailNotifications: state.user?.settings?.emailNotifications || false,
      darkMode: state.user?.settings?.darkMode || false,
    },
  });

  const onProfileSubmit = (data) => {
    // Here you would typically send this data to your backend API
    console.log('Profile data:', data);
    dispatch({ type: 'UPDATE_USER', payload: { ...state.user, ...data } });
  };

  const onSettingsSubmit = (data) => {
    console.log('Settings data:', data);
    dispatch({ type: 'UPDATE_USER_SETTINGS', payload: data });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Settings</h1>

      <Card>
        <CardHeader>
          <CardTitle>Profile Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" {...profileForm.register('name')} />
              {profileForm.formState.errors.name && (
                <p className="text-red-500 text-sm">{profileForm.formState.errors.name.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...profileForm.register('email')} />
              {profileForm.formState.errors.email && (
                <p className="text-red-500 text-sm">{profileForm.formState.errors.email.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="phone">Phone (optional)</Label>
              <Input id="phone" {...profileForm.register('phone')} />
              {profileForm.formState.errors.phone && (
                <p className="text-red-500 text-sm">{profileForm.formState.errors.phone.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="company">Company (optional)</Label>
              <Input id="company" {...profileForm.register('company')} />
            </div>
            <Button type="submit">Update Profile</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Application Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={settingsForm.handleSubmit(onSettingsSubmit)} className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="emailNotifications">Email Notifications</Label>
              <Switch
                id="emailNotifications"
                {...settingsForm.register('emailNotifications')}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="darkMode">Dark Mode</Label>
              <Switch
                id="darkMode"
                {...settingsForm.register('darkMode')}
              />
            </div>
            <Button type="submit">Save Settings</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}