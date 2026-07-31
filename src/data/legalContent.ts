export const LEGAL_CONTENT = {
  privacy: {
    title: "Privacy Policy",
    html: `
      <h4>Identification of the data controller:</h4>
      <p>Asociación Estudiantil Junior Empresa NEXIO (hereinafter "NEXIO") with NIF ID G75579508 and domicile in Paseo Uribitarte 6, 48001 Bilbao (Bizkaia). Contact: contact@team-nexio.com</p>

      <h4>Who is responsible for the processing of your data?</h4>
      <p>This privacy policy applies to all personal data that the data subject provides to NEXIO, as well as to any natural person interested in the activities and services that NEXIO offers through its web pages and through any other means of communication. The purpose of NEXIO's Privacy Policy is to give transparency to information on how we process your personal data in compliance with the current data protection regulations.</p>

      <h4>For what purpose do we process your personal data and with what legitimacy?</h4>
      <p>NEXIO has a Record of Processing Activities where each of the following processing carried out as the data controller are detailed:</p>
      <div style="overflow-x:auto;">
        <table style="width:100%; border-collapse: collapse; margin-top: 1rem; color: var(--muted); font-size: 0.85rem;">
          <thead>
            <tr style="border-bottom: 1px solid var(--border);">
              <th style="padding: 0.5rem; text-align: left;">PROCESSING</th>
              <th style="padding: 0.5rem; text-align: left;">PURPOSE</th>
              <th style="padding: 0.5rem; text-align: left;">LEGITIMATE BASIS</th>
            </tr>
          </thead>
          <tbody>
            <tr style="border-bottom: 1px solid var(--border);">
              <td style="padding: 0.5rem;">MEMBERS</td>
              <td style="padding: 0.5rem;">Management of personal data of members</td>
              <td style="padding: 0.5rem;">Art. 6.1 b) Contract performance</td>
            </tr>
            <tr style="border-bottom: 1px solid var(--border);">
              <td style="padding: 0.5rem;">CONTACT PEOPLE</td>
              <td style="padding: 0.5rem;">Contacts database management</td>
              <td style="padding: 0.5rem;">Art. 6.1 f) Legitimate interest</td>
            </tr>
            <tr style="border-bottom: 1px solid var(--border);">
              <td style="padding: 0.5rem;">EVENTS</td>
              <td style="padding: 0.5rem;">Management of participants</td>
              <td style="padding: 0.5rem;">Art. 6.1 a) Consent / Art. 6.1 f) Legitimate interest</td>
            </tr>
            <tr style="border-bottom: 1px solid var(--border);">
              <td style="padding: 0.5rem;">ACCOUNTABILITY</td>
              <td style="padding: 0.5rem;">Administrative management</td>
              <td style="padding: 0.5rem;">Art. 6.1 b) Contract performance</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h4>How long do we store your personal data?</h4>
      <p>NEXIO will store the data of the data subjects during their relationship with the organization and thereafter, according to the provisions of the archive and documentation regulations.</p>

      <h4>Who has access to your personal data?</h4>
      <p>NEXIO may make transfers or communications of personal data in order to meet its obligations with the Public Administrations.</p>

      <h4>What are the rights of those affected?</h4>
      <p>Right of access, rectification, deletion, limitation, objection, and portability. Such rights may be exercised free of charge by written request addressed to nexiocoop@gmail.com.</p>

      <h4>Unsubscribe from commercial communications</h4>
      <p>The interested party has the right to revoke consent at any time through the link in each communication or by statement to contact@team-nexio.com.</p>

      <h4>What security measures do we have implemented?</h4>
      <p>NEXIO adopts necessary measures to avoid alteration, loss, treatment or unauthorized access, in accordance with applicable regulations.</p>

      <h4>Modification of the Privacy Policy</h4>
      <p>NEXIO may modify its Privacy Policy in accordance with the applicable law at any time.</p>
      
      <p><em>Latest update: 27, March of 2025.</em></p>
    `
  },
  cookies: {
    title: "Cookies Policy",
    html: `
      <p>The JUNIOR ENTERPRISE STUDENT ASSOCIATION Nexio (hereinafter, Nexio) would like to inform you about the use of cookies on its websites.</p>
      
      <h4>Cookies Exempt from Consent</h4>
      <p>Certain technical cookies serving communication or specific requested services are exempt from explicit consent requirements under Art. 22.2 of Law 34/2002.</p>

      <h4>How to Modify Settings</h4>
      <p>You can restrict, block, or delete cookies through your browser settings (Chrome, Firefox, Safari, Edge).</p>
    `
  },
  legal: {
    title: "Legal Notice",
    html: `
      <p>Welcome to the website of ASOCIACION ESTUDIANTIL JUNIOR NEXIO (hereinafter NEXIO) with Tax Identification Number G75579508 and address at PS/ URIBITARTE, 6 48001 BILBAO (BIZKAIA). Contact by mail at contact@team-nexio.com and registered in the Registry of Associations of Bizkaia with the number AS/B/26060/2025.</p>

      <h4>Intellectual Property</h4>
      <p>The contents of this website, texts, images, sounds, animations, etc. as well as its graphic design and its source code are protected by Spanish legislation on intellectual and industrial property rights in favor of the companies that make up NEXIO. It is therefore prohibited its reproduction, distribution or public communication, totally or partially, without the express authorization of NEXIO.</p>

      <h4>Web content and links</h4>
      <p>At NEXIO we are not responsible for the misuse made of the contents of our website, being exclusive responsibility of the person who accesses them or uses them. We neither assume responsibility for the information contained on the third party´s web pages that can be accessed by links or search engines from this Web site.</p>

      <h4>Update and modification of the website</h4>
      <p>NEXIO, reserves the right to modify or remove, without prior notice, both the information contained on your website and its configuration and presentation, without assuming any responsibility for it.</p>

      <h4>Indications on technical aspects</h4>
      <p>NEXIO assumes no responsibility that can be derived from technical problems or failures in computer equipment that occur during connection to the Internet network, as well as damages that could be caused by third parties through illegitimate intrusions outside the control of NEXIO. We are also exempt from any responsibility for possible damages that the user may suffer as a result of errors, defects or omissions in the information we provide when coming from sources outside us.</p>
    `
  }
} as const;

export type LegalKey = keyof typeof LEGAL_CONTENT;
