//images imports
import evelogo from "../assets/images/logo.png";

//icon imports
import {
  MdSpaceDashboard,
  MdCategory,
  MdSettings,
  MdFeedback,
} from "react-icons/md";
import { BsFillCalendar3WeekFill } from "react-icons/bs";
import { FaWallet, FaTasks, FaUsers, FaQuestion } from "react-icons/fa";

export const webDetails = {
  name: "Eve.",
  logo: evelogo,
  quote:
    "Lorem ipsum dolor sit amet consectetur adipisicing elit. Enim, eaque id commodi omnis sed exercitationem?",
  description:
    "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ullam non necessitatibus fuga adipisci perferendis labore, rem nihil aspernatur officia, voluptatibus et, eum consectetur accusantium illum!",
  socialLinks: [
    {
      platform: "facebook",
      logo: (
        <svg
          fill="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          class="w-5 h-5"
          viewBox="0 0 24 24"
        >
          <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path>
        </svg>
      ),
      link: "fb.com",
    },
    {
      platform: "twitter",
      logo: (
        <svg
          fill="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          class="w-5 h-5"
          viewBox="0 0 24 24"
        >
          <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path>
        </svg>
      ),
      link: "twitter.com",
    },
    {
      platform: "instagram",
      logo: (
        <svg
          fill="none"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          class="w-5 h-5"
          viewBox="0 0 24 24"
        >
          <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
          <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01"></path>
        </svg>
      ),
      link: "instagram.com",
    },
    {
      platform: "linkedin",
      logo: (
        <svg
          fill="currentColor"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="0"
          class="w-5 h-5"
          viewBox="0 0 24 24"
        >
          <path
            stroke="none"
            d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"
          ></path>
          <circle cx="4" cy="4" r="2" stroke="none"></circle>
        </svg>
      ),
      link: "linkedin.com",
    },
  ],
};

export const navbarData = [
  {
    title: "EVENT",
    nav: [
      {
        icon: <MdSpaceDashboard />,
        title: "Dashboard",
        link: "/main",
      },
      {
        icon: <BsFillCalendar3WeekFill />,
        title: "New Booking",
        link: "/calendar",
      },
      {
        icon: <FaWallet />,
        title: "Payments",
        link: "/payments",
      },
    ],
  },
  {
    title: "ADMIN PANEL",
    nav: [
      {
        icon: <FaTasks />,
        title: "Events",
        link: "/admin/events",
      },
      {
        icon: <FaUsers />,
        title: "Users",
        link: "/admin/users",
      },
      {
        icon: <MdCategory />,
        title: "Categories",
        link: "/admin/categories",
      },
    ],
  },
  {
    title: "CONFIG",
    nav: [
      {
        icon: <MdSettings />,
        title: "Settings",
        link: "/settings",
      },
      {
        icon: <FaQuestion />,
        title: "FAQs",
        link: "/faqs",
      },
      {
        icon: <MdFeedback />,
        title: "Send Feedback",
        link: "/feedback",
      },
    ],
  },
];

export const faqData = [
  {
    question: "What is this website about?",
    answer:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Labore, veritatis, dolore nihil voluptatibus numquam dolorem modi neque eum cupiditate perferendis ut!",
  },
  {
    question: "What is this website about?",
    answer:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Labore, veritatis, dolore nihil voluptatibus numquam dolorem modi neque eum cupiditate perferendis ut!",
  },
  {
    question: "What is this website about?",
    answer:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Labore, veritatis, dolore nihil voluptatibus numquam dolorem modi neque eum cupiditate perferendis ut!",
  },
];
