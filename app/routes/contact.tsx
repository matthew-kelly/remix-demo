import { Form, useActionData, useTransition } from "remix";
import { sendEmail } from "~/utils/mailer";

export async function action({ request }) {
  let body = await request.formData();
  let name = body.get("name");
  let email = body.get("email");
  let message = await sendEmail({ to: email, text: name });
  return message;
}

export default function ContactPage() {
  const data = useActionData();
  // understand the page transition, loading states, and actions
  // if server side code is active, transition will tell you
  const transition = useTransition();
  return (
    <div>
      {data + " - " + transition.state}
      <h1>Contact Us</h1>
      {data === "success" ? (
        <p>Your message has been sent!</p>
      ) : (
        <Form method="post">
          <label>
            Name:
            <input type="text" name="name" />
          </label>
          <label>
            Email:
            <input type="email" name="email" />
          </label>
          {transition.state === "submitting" ? (
            <p>Sending...</p>
          ) : (
            <input type="submit" value="Send Message" />
          )}
        </Form>
      )}
    </div>
  );
}
