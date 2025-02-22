import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Linking,
  TouchableOpacity,
} from 'react-native';

const GovtSchemeScreen = () => {
  const schemes = [
    {
      name: 'PM Vishwakarma',
      description:
        'Launched on 17th September 2023, this scheme supports artisans and craftspeople who work with their hands and tools.',
      link: 'https://www.india.gov.in/spotlight/pm-vishwakarma-scheme',
    },
    {
      name: 'PM Kisan Samman Nidhi Yojana',
      description:
        'Provides income support of Rs.6,000 per year to farmers who have cultivable land.',
      link: 'https://www.pmkisan.gov.in/',
    },
    {
      name: 'PMAY - Pradhan Mantri Awas Yojana',
      description: 'A scheme aimed at providing affordable housing for all.',
      link: 'https://pmaymis.gov.in/',
    },
    {
      name: 'PMGSY - Pradhan Mantri Gram Sadak Yojana',
      description: 'A scheme to improve road infrastructure in rural areas.',
      link: 'https://www.pmgsy.nic.in/',
    },
    {
      name: 'MUDRA - Micro Units Development & Refinance Agency',
      description:
        'A scheme for providing financial support to micro businesses.',
      link: 'https://www.mudra.org.in/',
    },
    {
      name: 'Startup India',
      description: 'A scheme that supports the growth of startups in India.',
      link: 'https://www.startupindia.gov.in/',
    },
    {
      name: 'Atal Pension Yojana',
      description:
        'A pension scheme to provide a secure future for workers in the unorganized sector.',
      link: 'https://www.npscra.nsdl.co.in/',
    },
    {
      name: 'Ayushman Bharat - PMJAY',
      description:
        'A health scheme providing free health coverage of up to ₹5 lakh per family per year.',
      link: 'https://pmjay.gov.in/',
    },
    {
      name: 'Stand Up India Scheme',
      description:
        'Provides bank loans to SC/ST and women entrepreneurs for setting up greenfield enterprises.',
      link: 'https://www.standupmitra.in/',
    },
    {
      name: 'Digital India Mission',
      description:
        'A scheme to enhance digital infrastructure, improve online services, and promote digital literacy.',
      link: 'https://www.digitalindia.gov.in/',
    },
    {
      name: 'Skill India Mission',
      description:
        'A scheme to provide skill training to Indian youth and enhance employability.',
      link: 'https://www.skillindia.gov.in/',
    },
    {
      name: 'National Education Policy (NEP) 2020',
      description:
        'A comprehensive policy to transform the education system in India.',
      link: 'https://www.education.gov.in/',
    },
    {
      name: 'Beti Bachao Beti Padhao',
      description:
        'A scheme to promote the welfare of girl children and improve female education.',
      link: 'https://wcd.nic.in/schemes/beti-bachao-beti-padhao-scheme',
    },
    {
      name: 'Jal Jeevan Mission',
      description:
        'A scheme to provide tap water supply to every rural household.',
      link: 'https://jaljeevanmission.gov.in/',
    },
    {
      name: 'National Health Mission (NHM)',
      description:
        'A health initiative aimed at improving healthcare access and outcomes.',
      link: 'https://nhm.gov.in/',
    },
    {
      name: 'Rooftop Solar Scheme',
      description:
        'A scheme that provides financial support for installing solar panels on residential rooftops.',
      link: 'https://solarrooftop.gov.in/',
    },
    {
      name: 'E-Shram Portal',
      description:
        'A national database for unorganized workers to provide them social security benefits.',
      link: 'https://eshram.gov.in/',
    },
  ];

  const schemesPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(schemes.length / schemesPerPage);

  const startIndex = (currentPage - 1) * schemesPerPage;
  const paginatedSchemes = schemes.slice(
    startIndex,
    startIndex + schemesPerPage,
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>All Government Schemes</Text>
      <Text style={styles.countText}>Total Schemes: {schemes.length}</Text>
      <Text style={styles.pageText}>
        Page {currentPage} of {totalPages}
      </Text>

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false} // Hide the scroll bar
      >
        {paginatedSchemes.map((scheme, index) => (
          <View key={index} style={styles.schemeContainer}>
            <Text style={styles.schemeName}>{scheme.name}</Text>
            <Text style={styles.schemeDescription}>{scheme.description}</Text>
            <TouchableOpacity
              style={styles.linkButton}
              onPress={() => Linking.openURL(scheme.link)}>
              <Text style={styles.linkText}>Learn More</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      <View style={styles.paginationContainer}>
        <TouchableOpacity
          style={[
            styles.pageButton,
            currentPage === 1 && styles.disabledButton,
          ]}
          onPress={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}>
          <Text style={styles.pageButtonText}>Previous</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.pageButton,
            currentPage === totalPages && styles.disabledButton,
          ]}
          onPress={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}>
          <Text style={styles.pageButtonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f4f4f4',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  countText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  pageText: {
    fontSize: 14,
    marginBottom: 10,
    textAlign: 'center',
    margin: 5,
  },
  scrollContainer: {
    paddingBottom: 30, // Extra padding for smooth scrolling
    paddingHorizontal: 10,
  },
  schemeContainer: {
    marginBottom: 15,
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 8,
    elevation: 2, // Reduced shadow effect for subtle styling
  },
  schemeName: {
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  schemeDescription: {
    fontSize: 15,
    marginBottom: 10,
  },
  linkButton: {
    padding: 8,
    backgroundColor: '#28a745',
    borderRadius: 5,
    alignItems: 'center',
  },
  linkText: {
    color: '#fff',
    fontSize: 14,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  pageButton: {
    padding: 8,
    backgroundColor: '#FF9800',
    borderRadius: 5,
    alignItems: 'center',
    width: '40%',
  },
  disabledButton: {
    backgroundColor: '#cccccc',
  },
  pageButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default GovtSchemeScreen;
