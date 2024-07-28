'use client';

import { registerUser } from '@/actions/';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserPosition } from '@/types/position';
import { AnimatePresence, motion } from 'framer-motion';
import React, { FC, useRef, useState } from 'react';

type Props = {
  positions: UserPosition[];
};

const RegisterForm: FC<Props> = ({ positions }) => {
  const formRef = useRef<HTMLFormElement>(null);
  const randomId = Math.floor(Math.random() * 100);

  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);

  const handleSubmit = async (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();

    const formData = new FormData(formRef.current!);

    const res = await registerUser(formData);

    if (!res.success) {
      setUserId(null);
      setError(res.message);
      return;
    }

    setError(null);
    setUserId(res.user_id);
  };

  const animatePresenceProps = { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } };

  let content = (
    <>
      <motion.form {...animatePresenceProps} ref={formRef} onSubmit={handleSubmit} className="flex flex-col space-y-6">
        <div>
          <Label htmlFor="name">Name:</Label>
          <Input id="name" name="name" type="text" defaultValue={`name`}></Input>
        </div>
        <div>
          <Label htmlFor="email">Email:</Label>
          <Input id="email" name="email" type="email" defaultValue={`email-${randomId}@gmail.com`}></Input>
        </div>
        <div>
          <Label htmlFor="phone">Phone:</Label>
          <Input id="phone" name="phone" type="tel" defaultValue={`+38097`.padEnd(13, randomId.toString())}></Input>
        </div>
        <div>
          <Label htmlFor="photo">Photo:</Label>
          <Input type="file" id="photo" name="photo" />
        </div>
        <div>
          <Label htmlFor="position">Position:</Label>
          <Select name="position_id" defaultValue={positions[0].id.toString()}>
            <SelectTrigger id="position">
              <SelectValue placeholder="Position" className="text-slate-700" />
            </SelectTrigger>
            <SelectContent className="text-slate-700">
              {positions.map((p) => (
                <SelectItem key={p.id} value={p.id.toString()}>
                  {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button type="submit">Submit</Button>
      </motion.form>
      {error && (
        <motion.span {...animatePresenceProps} className="text-red-500">
          Error: {error}
        </motion.span>
      )}
    </>
  );

  if (userId)
    content = (
      <motion.span {...animatePresenceProps} className="text-green-500">
        User Id: {userId}
      </motion.span>
    );

  return <AnimatePresence>{content}</AnimatePresence>;
};

export default RegisterForm;
