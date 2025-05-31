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
        "By accessing and using BaybayInscribe, you accept and agree to be bound by the terms and provisions of this agreement. This includes all policies, guidelines, and rules referenced herein. Your continued use of the service constitutes acceptance of any modifications to these terms. If you do not agree to these terms, please do not use our service.",
    },
    {
      title: "2. Use License and Restrictions",
      content:
        "Permission is granted to temporarily use BaybayInscribe for personal, non-commercial purposes only. This license does not include modifying or copying our materials, using the materials for commercial purposes, attempting to reverse engineer any software contained on BaybayInscribe, removing any copyright or proprietary notations, or transferring the materials to another person or mirroring the materials on any other server. This license shall automatically terminate if you violate any of these restrictions.",
    },
    {
      title: "3. User Account Responsibilities",
      content:
        "You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. This includes creating a strong password and keeping it secure, not sharing your account credentials with others, promptly notifying us of any unauthorized access or security breaches, ensuring your account information remains accurate and up-to-date, and understanding that you are responsible for any content posted or actions taken through your account.",
    },
    {
      title: "4. Data Privacy and Protection",
      content:
        "BaybayInscribe complies with the Data Privacy Act of 2012 (Republic Act No. 10173) of the Philippines. We are committed to protecting your personal information while maintaining the free flow of information necessary for our services. Our data protection practices include implementing appropriate security measures, processing data only for legitimate purposes, maintaining data accuracy and relevance, limiting data retention periods, and ensuring secure data disposal. We regularly review and update our security measures to protect against unauthorized access, alteration, disclosure, or destruction of your personal information.",
    },
    {
      title: "5. Data Subject Rights",
      content:
        "Under the Data Privacy Act, you have the right to be informed about the processing of your personal data, including the purpose, extent, and methods of processing. You can access your personal data and obtain a copy in an electronic or structured format. You may object to the processing of your personal data, including profiling and automated processing. You have the right to erasure or blocking of your personal data when it is no longer necessary. You can claim damages due to inaccurate, incomplete, outdated, false, unlawfully obtained, or unauthorized use of your personal data. You have the right to data portability and to file complaints with the National Privacy Commission. We will respond to all requests to exercise these rights within the timeframes required by law.",
    },
    {
      title: "6. Data Protection Measures",
      content:
        "We implement comprehensive security measures to protect your personal data, including secure data storage and transmission using industry-standard encryption, multi-factor authentication and access controls, regular security assessments and vulnerability testing, employee training on data privacy and security, incident response procedures and breach notification protocols, regular backup and disaster recovery procedures, physical and environmental security controls, and vendor management and third-party security assessments. We regularly review and update these measures to address emerging threats and vulnerabilities.",
    },
    {
      title: "7. Facebook Integration and Third-Party Services",
      content:
        "Our Facebook integration and other third-party services are designed to enhance your experience while maintaining strict privacy standards. When you connect your Facebook account, we access only necessary information for authentication and service functionality, process data in accordance with the Data Privacy Act of 2012 and Facebook's Platform Terms, implement appropriate security measures for data transmission and storage, provide clear information about data usage and sharing, and allow you to revoke access at any time. We ensure all third-party integrations comply with applicable data protection laws and maintain appropriate security measures.",
    },
    {
      title: "8. Data Collection and Processing",
      content:
        "We collect and process your data in accordance with the Data Privacy Act of 2012 and other applicable laws. Our data processing activities include collecting only necessary information for service provision, processing data for legitimate purposes with your consent, implementing appropriate security measures, maintaining data accuracy and relevance, limiting data retention periods, and ensuring secure data disposal. We regularly review our data processing activities to ensure compliance with privacy laws and best practices.",
    },
    {
      title: "9. User Rights and Control",
      content:
        "You maintain comprehensive control over your data and can exercise your rights under the Data Privacy Act. You can access and review your personal data, correct inaccurate or incomplete information, request data deletion or modification, export your personal data in a portable format, object to specific data processing activities, revoke consent for data processing, file complaints with the National Privacy Commission, and seek damages for privacy violations. We provide clear procedures for exercising these rights and respond to all requests within the required timeframes.",
    },
    {
      title: "10. Disclaimer and Limitations",
      content:
        "The materials on BaybayInscribe are provided on an 'as is' basis. We make no warranties, expressed or implied, and hereby disclaim all other warranties, including implied warranties of merchantability, fitness for a particular purpose, non-infringement of intellectual property, accuracy of information, uninterrupted service, and security of data transmission. In no event shall BaybayInscribe or its suppliers be liable for any damages arising from the use or inability to use our services, including loss of data or profit, business interruption, system failure, security breaches, or third-party claims.",
    },
    {
      title: "11. Policy Updates and Notifications",
      content:
        "We may revise these terms of service at any time to reflect changes in our practices, legal requirements, or service offerings. We will notify you of any material changes through email notifications, website announcements, in-app notifications, or other appropriate communication channels. Your continued use of our services after such changes constitutes acceptance of the updated terms. We encourage you to review these terms periodically to stay informed about how we protect your information.",
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
      title: "1. Information We Collect",
      content:
        "We collect various types of information to provide and improve our services. This includes personal information such as your name, email address, contact number, date of birth, and profile picture. We also collect account information including username, authentication data, and account preferences. We gather usage data about how you interact with our services, device information such as browser type and operating system, and basic profile information when you connect your Facebook account. We collect this information to provide and improve our services, ensure security, and comply with legal obligations.",
    },
    {
      title: "2. How We Use Your Information",
      content:
        "We use your information to provide and maintain our services, process your transactions, and manage your account. We send important updates and notifications, improve our services and user experience, ensure security and prevent fraud, comply with legal obligations, and analyze usage patterns to enhance our services. We process your data based on your consent, contractual necessity, legal obligations, and legitimate interests.",
    },
    {
      title: "3. Information Sharing and Disclosure",
      content:
        "We may share your information with your consent, to comply with legal obligations, to protect our rights and prevent fraud, with service providers who assist in operating our services, in connection with a business transfer, and with Facebook when you use Facebook integration. We ensure all third parties maintain appropriate security measures and comply with data protection laws.",
    },
    {
      title: "4. Data Security and Protection",
      content:
        "We implement comprehensive security measures to protect your information. This includes encryption of data in transit and at rest, access controls and authentication mechanisms, regular security assessments and updates, employee training on data protection, incident response procedures, and regular backup and disaster recovery procedures. We regularly review and update our security measures to address emerging threats.",
    },
    {
      title: "5. Your Privacy Rights",
      content:
        "Under the Data Privacy Act of 2012, you have the right to access your personal data, correct inaccurate data, request data deletion, object to data processing, exercise data portability, withdraw consent, and file complaints with the National Privacy Commission. We provide clear procedures for exercising these rights and respond to all requests within the required timeframes.",
    },
    {
      title: "6. Data Retention",
      content:
        "We retain your personal data only for as long as necessary to fulfill the purposes for which it was collected. This includes providing our services, complying with legal obligations, resolving disputes, and enforcing our agreements. We regularly review our data retention practices and delete or anonymize data that is no longer needed.",
    },
    {
      title: "7. Cookies and Tracking Technologies",
      content:
        "We use cookies and similar tracking technologies to remember your preferences, understand how you use our services, improve our services, and provide personalized content. You can control cookie settings through your browser preferences. Some features may not function properly if you disable cookies.",
    },
    {
      title: "8. Children's Privacy",
      content:
        "Our services are not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately.",
    },
    {
      title: "9. International Data Transfers",
      content:
        "Your information may be transferred to and processed in countries other than your country of residence. We ensure appropriate safeguards are in place for such transfers, including standard contractual clauses, adequacy decisions, and binding corporate rules. We comply with applicable data protection laws regarding international transfers.",
    },
    {
      title: "10. Changes to This Policy",
      content:
        "We may update this privacy policy from time to time. We will notify you of any material changes through email notifications, website announcements, in-app notifications, or other appropriate communication channels. We encourage you to review this policy periodically to stay informed about how we protect your information.",
    },
  ],
};
