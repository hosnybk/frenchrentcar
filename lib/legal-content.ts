// Legal texts supplied by the company (French version), adapted to
// FRENCH FOR CAR RENTAL CO. Placeholders are replaced at render time:
// {company} company legal name, {email} contact e-mail, {whatsapp} WhatsApp number.

export type LegalBlock = {
  heading?: string;
  subheading?: string;
  paragraphs?: string[];
  items?: string[];
};

export type LegalDocument = {
  title: string;
  blocks: LegalBlock[];
};

export const companyLegalName = "FRENCH FOR CAR RENTAL CO.";

/** Arabic business name, as shown on the trade licence receipt. */
export const companyLegalNameAr = "شركة فرنسية لتأجير السيارات";

/** Trade licence number (from the licence renewal receipt of 04/11/2025). Hidden when empty. */
export const tradeLicense = "1262826";

export const privacyFr: LegalDocument = {
  title: "Politique de confidentialité",
  blocks: [
    {
      paragraphs: [
        "Cette politique de confidentialité décrit la manière dont {company} recueille, utilise et partage vos informations par le biais de son site web. La présente politique de confidentialité ne s’applique pas à nos activités de collecte de données hors ligne ou en dehors de nos services (sauf indication contraire). En utilisant nos services, vous acceptez nos conditions d’utilisation.",
      ],
    },
    {
      heading: "Les données que nous collectons",
      paragraphs: [
        "Lorsque vous vous inscrivez et devenez notre utilisateur, vous pouvez être invité à nous fournir des données personnelles et des informations vous concernant. Ces informations sont collectées par les moyens suivants :",
      ],
      items: [
        "Informations relatives à l’inscription : telles que votre nom, votre adresse électronique, votre nom d’utilisateur, votre mot de passe et toute autre information demandée lors de l’inscription.",
        "Informations provenant de votre activité : ces informations comprennent les adresses IP utilisées pour connecter votre ordinateur à Internet, le type et la langue du navigateur, les pages et URL de référence et de sortie, la date et l’heure, la durée des visites sur des pages spécifiques et vos informations de connexion.",
        "Informations provenant des cookies : nous collectons des informations par le biais de cookies stockés par les sites web sur votre appareil.",
        "Informations que vous nous avez fournies : vous pouvez nous fournir volontairement des informations supplémentaires vous concernant, y compris, mais sans s’y limiter, le nom, l’adresse, le sexe, le pays, les préférences en matière de services et d’autres informations fournies en remplissant les formulaires disponibles sur notre plateforme ou en nous contactant par téléphone, par courrier électronique, par WhatsApp ou par tout autre moyen.",
        "Informations relatives au paiement et à la carte : vous pouvez nous fournir des informations de paiement, y compris le numéro de votre carte de crédit ou de débit, la date d’expiration de la carte, le code CVV et d’autres données.",
        "Les informations que vous nous fournissez lorsque vous nous contactez pour obtenir de l’aide.",
      ],
    },
    {
      paragraphs: [
        "Vous devez fournir des informations complètes, correctes et précises, préserver la confidentialité des informations relatives à votre compte et à votre mot de passe, et préciser les personnes autorisées à accéder à votre compte et à l’utiliser. Dans le cas contraire, vous serez responsable de tout dommage résultant de l’inexactitude ou de l’absence de mise à jour de ces données. Nous pouvons partager les informations susmentionnées avec des tiers dans le but de concevoir, d’analyser, de gérer, de mesurer et d’améliorer les publicités sur le site et autres.",
      ],
    },
    {
      heading: "Utilisation des données personnelles",
      paragraphs: [
        "Nous pouvons utiliser les données personnelles que nous collectons, conformément aux dispositions de la législation sur la protection des données, pour :",
      ],
      items: [
        "Vérifier votre identité.",
        "Fournir un meilleur service à nos clients, évaluer, améliorer et développer nos services et vous informer de ces changements.",
        "Des fins promotionnelles et informatives, y compris le marketing direct, les études de marché et les sondages.",
        "Vous fournir les informations les plus pertinentes au regard de vos intérêts et vous envoyer des messages marketing.",
        "Les besoins de notre activité et nos intérêts légitimes, tels que l’analyse des données, l’audit, le contrôle, ainsi que la réduction et la prévention de la fraude et du piratage de logiciels.",
        "Personnaliser ou améliorer votre expérience d’utilisation du site web et des services.",
        "Contribuer à maintenir l’intégrité et la sécurité des systèmes et des services.",
        "Fournir des services de paiement et des services connexes sur le site.",
        "Mesurer l’efficacité des publicités présentées sur le site et vous proposer des publicités adaptées, ce qui peut dépendre de votre activité sur le site.",
        "Toute autre utilisation après avoir obtenu votre consentement, si nous souhaitons utiliser vos informations personnelles à des fins autres que celles auxquelles vous avez préalablement consenti.",
      ],
    },
    {
      heading: "Partage des informations",
      paragraphs: ["Nous pouvons partager des informations vous concernant, si nécessaire, aux fins suivantes :"],
      items: [
        "Respecter les procédures légales et répondre aux demandes des autorités publiques et gouvernementales.",
        "Mettre en œuvre nos conditions générales.",
        "Protéger nos droits, notre vie privée, notre sécurité, nos biens et/ou vos droits ou ceux d’autres personnes.",
        "Limiter ou réduire les dommages que nous pourrions subir.",
      ],
    },
    {
      paragraphs: ["Nous pouvons également partager des informations avec nos affiliés à des fins commerciales internes, par exemple pour :"],
      items: [
        "Traiter et satisfaire vos demandes.",
        "Fournir un service à la clientèle.",
        "Améliorer nos services.",
      ],
    },
    {
      paragraphs: [
        "Nous pouvons également communiquer des informations à un tiers dans le cadre d’une réorganisation, d’une fusion, d’une vente, d’une coentreprise, d’une cession, d’un transfert ou de toute autre forme d’aliénation de tout ou partie de notre entreprise ou de nos actifs, y compris au cours de négociations.",
        "Lorsque {company} fait appel à des prestataires de services tiers et que la communication d’informations personnelles à ces prestataires est nécessaire pour fournir un service, {company} s’assure que ces prestataires protègent les informations personnelles d’une manière conforme à la présente politique de confidentialité.",
      ],
    },
    {
      heading: "Conservation des données personnelles",
      paragraphs: [
        "Nous ne conservons vos données personnelles qu’aussi longtemps que cela est nécessaire aux fins pour lesquelles elles sont traitées. Nous nous réservons le droit de revoir la présente politique de confidentialité et vous conseillons de la consulter régulièrement.",
      ],
    },
    {
      heading: "Protection de vos données personnelles",
      paragraphs: [
        "{company} s’engage à traiter les informations de votre compte avec un haut niveau de sécurité et à protéger les données personnelles contre l’accès, l’utilisation ou la divulgation non autorisés. Les données relatives aux cartes de crédit et de débit et aux comptes bancaires sont uniquement stockées sous forme cryptée sur des ordinateurs qui ne sont pas connectés à Internet. Toutefois, ce niveau de protection n’est pleinement efficace que si vous appliquez vous-même de bonnes pratiques de sécurité. Vous ne devez pas partager les données de votre compte avec qui que ce soit. Si vous craignez que l’une de vos données personnelles ait été divulguée, vous devez la modifier immédiatement après vous être connecté à votre compte.",
      ],
    },
    {
      heading: "Traitement des données",
      paragraphs: [
        "{company} s’efforce de ne traiter que des données personnelles exactes et à jour. Vous avez donc le droit d’obtenir la rectification des données personnelles inexactes vous concernant.",
      ],
      items: [
        "{company} a le droit de supprimer les données personnelles qui ne sont plus nécessaires au regard des finalités pour lesquelles elles ont été collectées ou traitées.",
        "Vous avez le droit de demander la rectification ou l’effacement de vos données personnelles, de demander la limitation de leur traitement ou de vous opposer à ce traitement.",
        "Vous avez le droit d’empêcher {company} de traiter vos données si vous avez une raison particulière de le faire.",
        "Vous avez le droit de vous opposer au traitement de vos données personnelles fondé sur des décisions automatisées.",
        "Vous avez le droit de déposer une plainte auprès de l’autorité de contrôle compétente.",
        "{company} ne fait appel qu’à des sous-traitants qui présentent des garanties suffisantes quant à la mise en œuvre de mesures techniques et organisationnelles appropriées, afin que le traitement respecte et protège les droits de toutes les personnes concernées.",
      ],
    },
    {
      heading: "Liens vers des sites web externes",
      paragraphs: [
        "Le site de {company} peut contenir des liens qui renvoient l’utilisateur ou le visiteur vers des applications, des liens ou des sites web externes susceptibles de collecter des informations vous concernant et de les divulguer d’une manière différente de la nôtre.",
        "{company} ne contrôle pas les pratiques de confidentialité des applications et sites web externes et n’est pas responsable de leur contenu ni de leurs politiques de confidentialité. Nous vous invitons à prendre connaissance de la politique de confidentialité et des conditions d’utilisation applicables lorsque vous visitez des applications ou des sites externes.",
        "Nous ne sommes pas responsables de la collecte, de l’utilisation ou de la divulgation d’informations par une autre application ou un autre site web vers lequel un lien figure sur notre site.",
      ],
    },
    {
      heading: "Modifications de la politique de confidentialité",
      paragraphs: [
        "{company} peut amender, modifier ou changer cette politique, en tout ou en partie, à tout moment et sans préavis. Nous ne sommes pas responsables du fait que vous n’ayez pas consulté cette politique avant ou après toute action y afférente. Si vous n’êtes pas d’accord avec une modification apportée à cette politique, la seule solution est de cesser d’utiliser le site. La navigation sur le site et la lecture de cette politique valent approbation et acceptation de l’ensemble de ses dispositions.",
      ],
    },
    {
      heading: "Accord sur les cookies",
      paragraphs: [
        "Lorsque vous visitez le site de {company}, des cookies peuvent être enregistrés dans votre navigateur web, sur ordinateur ou sur appareil mobile. Les cookies sont de petits fichiers texte envoyés par les sites web et stockés sur votre ordinateur, tablette, smartphone ou tout autre appareil. Ils sont utilisés pour l’une des raisons suivantes :",
      ],
      items: [
        "Vous reconnaître lorsque vous revenez sur le site.",
        "Conserver les informations personnelles que vous enregistrez sur le site, telles que votre nom ou votre e-mail, afin de vous les proposer à nouveau.",
        "Vous permettre de recevoir des messages ou des services le plus rapidement possible, en fonction de vos préférences antérieures.",
      ],
    },
    {
      paragraphs: [
        "{company} ne divulgue pas les cookies des utilisateurs ou des visiteurs à des tiers, à l’exception de ceux mentionnés dans la présente politique, sauf en cas d’obligation légale, telle qu’un mandat de perquisition, une décision de justice ou une injonction légale.",
        "Les cookies ne sont pas des fichiers exécutables, ce sont de simples fichiers texte ; ils ne sont ni des logiciels espions ni des virus.",
      ],
    },
    {
      heading: "Cookies de tiers",
      paragraphs: [
        "Des cookies tiers peuvent être déposés par des services intégrés au site. {company} n’a aucun contrôle sur ces fichiers. Il peut s’agir, par exemple, de cookies déposés par Google, Facebook ou Twitter. Pour plus d’informations sur ces cookies, nous vous recommandons de consulter les sites web de ces tiers.",
      ],
    },
    {
      heading: "Acceptation de la politique",
      paragraphs: [
        "Vous reconnaissez avoir lu la présente politique de confidentialité et en accepter tous les termes et conditions. En continuant à utiliser le site web ou les services de {company}, vous acceptez d’être lié par cette politique. Si vous n’acceptez pas ses conditions, vous n’êtes pas autorisé à utiliser ou à accéder au site web de {company} et à ses services.",
      ],
    },
    {
      heading: "Contact",
      paragraphs: [
        "Pour toute question, réclamation ou demande concernant la présente politique, le site web, les services ou vos informations, vous pouvez nous contacter par e-mail à {email} ou par WhatsApp au {whatsapp}.",
      ],
    },
  ],
};

export const termsFr: LegalDocument = {
  title: "Conditions générales",
  blocks: [
    {
      heading: "Responsabilités",
      items: [
        "Le locataire déclare recevoir le véhicule choisi en bon état. Le locataire reconnaît également que le véhicule sera restitué à {company} dans le même état à la fin de la période de location (y compris tous les accessoires).",
        "{company} se réserve le droit de reprendre le véhicule à tout moment si le locataire enfreint les conditions générales de la société.",
        "{company} n’est pas responsable de la perte de bagages.",
        "{company} se réserve le droit de modifier ses conditions générales sans préavis.",
      ],
    },
    {
      heading: "Limites géographiques",
      paragraphs: [
        "Les véhicules loués par {company} ne peuvent être conduits qu’à l’intérieur des frontières des Émirats arabes unis.",
      ],
    },
    {
      heading: "Limites de kilométrage",
      subheading: "Location à la journée / à la semaine",
      paragraphs: [
        "La distance journalière autorisée est de 200 kilomètres. Au-delà, chaque kilomètre est facturé (de 1 à 25 AED/km) en fonction du type de voiture.",
      ],
    },
    {
      heading: "Politique de carburant",
      paragraphs: [
        "Le véhicule doit être restitué à la fin de la période de location avec le même niveau de carburant qu’au départ. Des frais de carburant seront appliqués si le niveau est inférieur.",
      ],
    },
    {
      heading: "Dommages",
      items: [
        "Le locataire est tenu de s’assurer que les pneus sont correctement gonflés à tout moment.",
        "Le locataire est tenu de veiller à ce que le véhicule et ses équipements ne soient ni endommagés ni manipulés.",
        "Le locataire est tenu de veiller à ce que le véhicule soit propre, à l’intérieur comme à l’extérieur.",
        "Le locataire est responsable de tous les frais de réparation encourus pendant la période de location.",
        "Le locataire n’est pas autorisé à faire appel à un service de réparation tiers. S’il tente de faire réparer le véhicule dans une agence ou un garage, une amende estimée par {company} lui sera appliquée.",
        "En cas de dommage ou d’accident, le locataire doit contacter la police (999) et {company} ({whatsapp}).",
        "Le locataire doit obtenir un rapport de police pour tout dommage survenu pendant la période de location.",
      ],
    },
    {
      heading: "Période de location et politique de retour",
      items: [
        "Les frais de location sont calculés par période de 24 heures.",
        "Si la voiture est restituée après l’heure convenue à la date de retour, une journée entière supplémentaire est facturée.",
        "Les restitutions ne sont pas effectuées les vendredis et les jours fériés.",
        "Pour la reprise du véhicule à la date de retour à Dubaï, le locataire doit informer {company} au moins 4 heures avant l’heure de reprise.",
        "Pour la reprise du véhicule à la date de retour dans les autres Émirats, le locataire doit informer {company} au moins 24 heures avant l’heure de reprise.",
      ],
    },
    {
      heading: "Paiements et autres frais",
      subheading: "Dépôt de garantie",
      items: [
        "{company} se charge de l’entretien de la voiture de location. Un dépôt de garantie, dont le montant dépend du type de voiture, est demandé avant la remise du véhicule au locataire.",
        "Les montants de l’assurance peuvent varier en fonction de la catégorie de voiture choisie.",
        "Le dépôt est conservé pendant 25 jours après la date de restitution afin de couvrir les amendes ou les frais Salik engagés par le locataire.",
      ],
    },
    {
      subheading: "Salik",
      items: [
        "Un montant de 5 AED est facturé pour chaque passage Salik.",
        "Les tarifs des péages Salik peuvent être modifiés sans préavis.",
        "Une TVA de 5 % s’applique aux frais de service de {company}.",
      ],
    },
    {
      subheading: "Amendes",
      items: [
        "Le locataire supporte toutes les amendes commises pendant la période de location.",
        "Les amendes inférieures à 200 AED entraînent des frais de service d’au moins 20 AED.",
        "Une taxe sur la valeur ajoutée de 5 % s’applique aux frais de service.",
      ],
    },
    {
      heading: "Service et entretien",
      items: [
        "Tous les frais de location comprennent l’entretien périodique.",
        "Le locataire doit prévenir {company} au moins deux jours avant le prochain entretien.",
        "En cas de panne du véhicule, {company} fournira un véhicule de remplacement dans les plus brefs délais.",
        "Le locataire est responsable des véhicules qui n’ont pas été présentés à l’entretien aux dates prévues et qui ont été endommagés.",
        "Le locataire supportera tous les coûts de réparation et la période de location sera prolongée pour couvrir le temps nécessaire à la réparation des dommages.",
        "Le locataire n’autorise aucun tiers à réparer le véhicule de location sans l’accord écrit de {company}.",
        "Le locataire est responsable de la réparation de toutes les crevaisons.",
        "L’équipe d’inspection vérifie que les pneus ne sont pas endommagés par des crevaisons ; des frais sont facturés au locataire le cas échéant.",
        "Le locataire doit informer {company} de tout dommage ou défaillance mécanique. Le locataire sera responsable de tout dommage résultant d’une déclaration tardive.",
        "Le locataire prend en charge la totalité des frais de réparation si le véhicule est endommagé en raison d’une crevaison.",
        "Les problèmes liés à l’entretien ou aux pannes peuvent être signalés au {whatsapp}.",
      ],
    },
    {
      heading: "Assurance",
      items: [
        "Toute voiture louée auprès de {company} est assurée uniquement pour la conduite sur les routes goudronnées des Émirats arabes unis.",
        "En cas de dommage au véhicule, le locataire doit obtenir un rapport de police, faute de quoi il sera responsable de tous les frais de réparation.",
        "Les dommages causés au pare-brise, aux pneus, aux jantes, aux outils et aux enjoliveurs ne sont pas couverts par l’assurance.",
      ],
    },
    {
      heading: "Questions juridiques",
      subheading: "Âge",
      paragraphs: ["Tous les locataires doivent être âgés d’au moins 18 ans."],
    },
    {
      subheading: "Mise en fourrière du véhicule",
      items: [
        "Si la voiture est mise en fourrière, le locataire devra payer les frais de fourrière à {company} et perdra les frais de location correspondants.",
        "Le locataire doit s’assurer que la voiture de location est toujours garée dans un endroit sûr et que toutes les portes sont verrouillées.",
        "Le locataire est responsable de tout dommage causé au véhicule.",
        "Le locataire est responsable de la perte des clés. Le montant minimum facturé pour une clé perdue est de 2 000 AED ; il peut varier selon la catégorie du véhicule.",
        "Toute amende de stationnement encourue par le locataire lui sera facturée, en plus des frais administratifs.",
      ],
    },
    {
      heading: "Politique en matière de cookies",
      subheading: "Qu’est-ce qu’un cookie ?",
      items: [
        "Un cookie est un fichier texte d’identification unique.",
        "Certaines informations sont automatiquement collectées lorsque vous visitez notre site.",
        "Ces informations sont collectées dans le but d’améliorer votre expérience en ligne.",
        "En continuant à utiliser ce site, vous acceptez notre politique en matière de cookies.",
      ],
    },
    {
      subheading: "Quels cookies utilisons-nous ?",
      items: ["Cookies de session", "Cookies persistants", "Cookies de ciblage", "Cookies analytiques", "Balises pixel"],
      paragraphs: [
        "Les balises pixel peuvent être utilisées sur certaines pages web et dans certains e-mails. Elles permettent à l’entreprise de suivre le comportement des utilisateurs et d’obtenir des données sur les destinations populaires, les tarifs de location moyens, les taux de conversion, etc. Elles nous aident à offrir une meilleure expérience à nos clients et à améliorer continuellement nos services.",
      ],
    },
    {
      subheading: "Désactiver et supprimer les cookies",
      paragraphs: [
        "Si vous ne souhaitez pas que nous utilisions des cookies, vous pouvez les supprimer après votre visite sur le site via l’historique de navigation de votre navigateur.",
      ],
    },
    {
      heading: "Réservation en ligne – conditions générales",
      paragraphs: ["Les conditions de réservation en ligne sont en vigueur à partir du 01/01/2020."],
    },
    {
      subheading: "Confirmation de la sélection",
      paragraphs: [
        "Après avoir choisi le service souhaité, le client est invité à renseigner ses informations et à vérifier le récapitulatif de sa réservation, puis à accepter définitivement les conditions de réservation.",
      ],
    },
    {
      subheading: "Notification et confirmation",
      paragraphs: [
        "{company} vous enverra une confirmation comprenant tous les détails de la réservation. Le client recevra un message final de confirmation après avoir effectué toutes les étapes du processus.",
      ],
    },
    {
      subheading: "Prix",
      paragraphs: [
        "Votre devis final de {company} inclut : tous les frais obligatoires, la taxe sur la valeur ajoutée et toute autre taxe applicable par les autorités gouvernementales, les kilomètres inclus, l’assurance responsabilité civile collision et l’assurance contre le vol.",
      ],
    },
    {
      subheading: "Paiements",
      paragraphs: ["Il existe deux modes de paiement :"],
      items: [
        "Réserver et payer maintenant : prépaiement par virement bancaire sur le compte de l’entreprise. Les tarifs prépayés sont disponibles en ligne et le montant estimé doit être payé en totalité au moment de la réservation.",
        "Réserver et payer à l’agence : paiement directement à l’agence de {company}.",
      ],
    },
    {
      subheading: "Moyens de paiement",
      paragraphs: ["Le paiement peut être effectué par les moyens suivants :"],
      items: [
        "Cartes de crédit : les cartes généralement acceptées par {company} sont Mastercard et Visa.",
        "Cartes de débit : elles doivent être liées à un compte bancaire pour être acceptées.",
        "Cartes Maestro.",
        "Cartes Visa Electron.",
      ],
    },
    {
      subheading: "Dépôt de garantie",
      items: [
        "Le dépôt de garantie est un montant qui s’ajoute au prix total de la location.",
        "Le locataire sera informé de la forme exacte de la caution.",
        "Le dépôt permet à {company} d’obtenir une garantie avant le début de la période de location.",
        "Le montant du dépôt requis varie en fonction de la catégorie de véhicule choisie.",
        "Le dépôt de garantie est maintenu pendant toute la durée de la location.",
        "La caution est restituée au locataire dans un délai maximum de 30 jours à compter de la date de restitution du véhicule.",
        "Au moment de la restitution, tous les paiements doivent être réglés.",
      ],
    },
    {
      subheading: "Autres demandes",
      paragraphs: [
        "Pour toute information complémentaire, vous pouvez contacter le service de réservation de {company} par WhatsApp au {whatsapp}. Nous serons heureux de répondre à vos questions.",
      ],
    },
    {
      heading: "Autres conditions générales",
      items: [
        "Si le locataire est un touriste titulaire d’un permis de conduire d’un pays reconnu par les Émirats arabes unis, il doit signer un contrat stipulant que, s’il obtient la résidence aux Émirats arabes unis, il s’engage à échanger son permis contre un permis émirien. Il est illégal de conduire aux Émirats arabes unis avec un permis étranger une fois le statut de résident obtenu.",
        "Tout accident ou dommage causé à la voiture de location par un conducteur sous l’influence de l’alcool ou de drogues engage l’entière responsabilité du locataire.",
        "Le locataire doit s’assurer que seuls les conducteurs inscrits au contrat sont autorisés à conduire le véhicule.",
        "Le locataire n’est pas autorisé à teinter les vitres de la voiture ni à y apposer ses propres autocollants. Une amende sera appliquée par {company} pour ces infractions et le locataire sera entièrement responsable des pénalités imposées par les autorités.",
        "Tous les litiges et contestations relatifs à la facturation, aux comptes, à l’entretien et aux services sont traités à l’adresse : {email}.",
      ],
    },
  ],
};
