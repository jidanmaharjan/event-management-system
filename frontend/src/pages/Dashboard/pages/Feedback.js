import React from "react";
import {
  TextInput,
  Textarea,
  SimpleGrid,
  Group,
  Title,
  Button,
} from "@mantine/core";
import { useForm } from "@mantine/form";

const Feedback = () => {
  const form = useForm({
    initialValues: {
      subject: "",
      message: "",
    },
    validate: {
      subject: (value) => value.trim().length === 0,
      message: (value) => value.trim().length === 0,
    },
  });
  return (
    <form
      className="p-4 text-white font-poppins"
      onSubmit={form.onSubmit(() => {})}
    >
      <Title className="font-semibold text-xl mb-4">Send Feedback</Title>

      <TextInput
        className=""
        placeholder="Subject"
        mt="md"
        name="subject"
        variant="filled"
        {...form.getInputProps("subject")}
      />
      <Textarea
        className=""
        mt="md"
        placeholder="Your message"
        maxRows={10}
        minRows={5}
        autosize
        name="message"
        variant="filled"
        {...form.getInputProps("message")}
      />
      <Button
        className="mt-4 bg-emerald-700 hover:bg-emerald-600"
        type="submit"
        size="md"
      >
        Send message
      </Button>
    </form>
  );
};

export default Feedback;
