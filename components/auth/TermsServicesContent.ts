/**
 * Interface for section content in terms and privacy policy
 */
interface Section {
  title: string;
  content: string;
}

/**
 * Interface for terms and privacy policy content
 */
interface PolicyContent {
  title: string;
  sections: Section[];
}

/**
 * Terms of Service content
 */
export const termsOfServiceContent: PolicyContent = {
  title: "Terms of Service",
  sections: [
    {
      title: "1. Acceptance of Terms",
      content:
        "By accessing and using BaybayInscribe, you accept and agree to be bound by the terms and provision of this agreement.",
    },
    {
      title: "2. Use License",
      content:
        "Permission is granted to temporarily use BaybayInscribe for personal, non-commercial transitory viewing only.",
    },
    {
      title: "3. User Account",
      content:
        "You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account.",
    },
    {
      title: "4. Privacy Policy",
      content:
        "Your use of BaybayInscribe is also governed by our Privacy Policy. Please review our Privacy Policy, which also governs the site and informs users of our data collection practices.",
    },
    {
      title: "5. Disclaimer",
      content:
        "The materials on BaybayInscribe are provided on an 'as is' basis. BaybayInscribe makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.",
    },
    {
      title: "6. Limitations",
      content:
        "In no event shall BaybayInscribe or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on BaybayInscribe.",
    },
    {
      title: "7. Revisions",
      content:
        "BaybayInscribe may revise these terms of service at any time without notice. By using this website, you are agreeing to be bound by the then current version of these terms of service.",
    },
  ],
};

/**
 * Privacy Policy content
 */
export const privacyPolicyContent: PolicyContent = {
  title: "Privacy Policy",
  sections: [
    {
      title: "1. Information Collection",
      content:
        "We collect information that you provide directly to us, including but not limited to your name, email address, and any other information you choose to provide.",
    },
    {
      title: "2. Use of Information",
      content:
        "We use the information we collect to provide, maintain, and improve our services, to develop new ones, and to protect BaybayInscribe and our users.",
    },
    {
      title: "3. Information Sharing",
      content:
        "We do not share your personal information with third parties except as described in this privacy policy.",
    },
    {
      title: "4. Data Security",
      content:
        "We take reasonable measures to help protect information about you from loss, theft, misuse, unauthorized access, disclosure, alteration, and destruction.",
    },
    {
      title: "5. Your Rights",
      content:
        "You have the right to access, correct, or delete your personal information. You can also object to our processing of your personal information.",
    },
    {
      title: "6. Changes to Policy",
      content:
        "We may change this privacy policy from time to time. We will post any privacy policy changes on this page.",
    },
  ],
};
