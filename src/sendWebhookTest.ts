import axios from "axios";

// Define the payload structure
const payload = {
  title: "This happened today at ITAM",
  description: "This is a sample post",
  slug: "this-happened-today-at-itam",
  media: [
    {
      url: "https://res.cloudinary.com/dg8cmo2gb/image/upload/v1732618339/blog_posts/g12wzcr5gw1po9c80zqr.jpg",
      type: "image",
    },
    {
      url: "https://res.cloudinary.com/dg8cmo2gb/image/upload/v1732618339/blog_posts/g12wzcr5gw1po9c80zqr.jpg",
      type: "image",
    },
  ],
  fullUrl: "https://chran1.vercel.app/blog/this-happened-today-at-itam",
};

// Define the webhook URL
const webhookUrl = "https://hook.eu2.make.com/1iq799yjpugo0v7fgwwfggvj21qyrren";

// Send the request using Axios
const sendTestRequest = async () => {
  try {
    const response = await axios.post(webhookUrl, payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log("Webhook test sent successfully:", response.data);
  } catch (error: any) {
    console.error("Error sending test request:", error.message);
    if (error.response) {
      console.error("Response data:", error.response.data);
    }
  }
};

// Run the function
sendTestRequest();
