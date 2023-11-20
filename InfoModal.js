import { StyleSheet, Text, TouchableOpacity, Modal, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default InfoModal = ({ setShowInfo }) => {
    return (
    <Modal visible={true} animationType="fade" transparent>
    <ScrollView style={styles.modalContainer} contentContainerStyle={{ justifyContent: 'center', alignItems: 'center', }}>
      <View style={styles.modalContent}>
        <View style={styles.sectionContainer}>
          <Text style={styles.label}>Generelt</Text>
          <View style={styles.symbolHeader}>
            <View style={styles.verified}>
              <MaterialIcons name="verified-user" size={20} color="green" />
            </View>
            <Text style={styles.modalTitle}>- Verifierad</Text>
          </View>
          <Text style={styles.modalDescription}>
              När denna symbol visas brevid livsmedelsproduktens namn innebär det att 
              allergeninformationen är verfierad av utvecklarna eller matproducenten. 
              Om denna ikon inte visas brevid namnet innebär det att allergeninformationen 
              är inskriven av en användare vilket innebär att vi inte kan garantera 
              att den stämmer,  
              <Text style={styles.redText}> följ denna allergeninformationen på egen risk.</Text>
           </Text>
        </View>
        <View style={styles.sectionContainer}>
        <Text style={styles.label}>Färger</Text>
        <View>
          <View style={styles.symbolHeader}>
            <View key={'glutenColor'} style={styles.greenIconContainer}>
              <MaterialCommunityIcons name="barley" size={15} color="white" />
            </View>
            <Text style={styles.modalTitle}>- Grönt</Text>
          </View>
          <Text style={styles.modalDescription}>
            När en symbol är grön innebär det att den inte innehåller allergen och/eller passar att äta.
          </Text>
        </View>
        <View>
          <View style={styles.symbolHeader}>
            <View key={'glutenColor'} style={styles.yellowIconContainer}>
              <MaterialCommunityIcons name="barley" size={15} color="white" />
            </View>
            <Text style={styles.modalTitle}>- Gult</Text>
          </View>
          <Text style={styles.modalDescription}>
            När en symbol är gul innebär det att det kan finnas spår av det man vill undvika eller att det inte finns uppgifter gällande den allegenen/matpreferensen. Ät dessa på egen risk.
          </Text>
        </View>
        <View>
          <View style={styles.symbolHeader}>
            <View key={'glutenColor'} style={styles.redIconContainer}>
              <MaterialCommunityIcons name="barley" size={15} color="white" />
            </View>
            <Text style={styles.modalTitle}>- Rött</Text>
          </View>
          <Text style={styles.modalDescription}>
            När en symbol är röd innebär det att den innehåller det man vill undvika och att den inte borde/ska ätas.
          </Text>
        </View>
        <View>
          <View style={styles.symbolHeader}>
            <View key={'glutenColor'} style={styles.greyIconContainer}>
              <MaterialCommunityIcons name="barley" size={15} color="white" />
            </View>
            <Text style={styles.modalTitle}>- Grått</Text>
          </View>
          <Text style={styles.modalDescription}>
            När en symbol är grå innebär det att information om den preferencen/allergenen saknas för det livsmedlet.
          </Text>
        </View>
        </View>
        <View style={styles.sectionContainer}>
        <Text style={styles.label}>Symboler</Text>
        <View>
          <View style={styles.symbolHeader}>
            <View key={'gluten'} style={styles.greenIconContainer}>
              <MaterialCommunityIcons name="barley" size={15} color="white" />
            </View>
            <Text style={styles.modalTitle}>- Gluten</Text>
          </View>
          <Text style={styles.modalDescription}>
            Gluten är ett protein som finns i vete, korn och råg. Det finns vanligtvis i livsmedel som bröd, pasta och bakverk.
          </Text>
        </View>
        <View>
          <View style={styles.symbolHeader}>
            <View key={'dairy'} style={styles.greenIconContainer}>
              <MaterialCommunityIcons name="cup-water" size={15} color="white" />
            </View>
            <Text style={styles.modalTitle}>- Mejeriprodukter</Text>
          </View>
          <Text style={styles.modalDescription}>
            Mejeriprodukter inkluderar mjölk, ost, smör och yoghurt. De är en vanlig källa till laktos, vilket kan orsaka intolerans eller allergier hos vissa individer.
          </Text>
        </View>
        <View>
          <View style={styles.symbolHeader}>
            <View key={'nuts'} style={styles.greenIconContainer}>
              <MaterialCommunityIcons name="peanut" size={15} color="white" />
            </View>
            <Text style={styles.modalTitle}>- Nötter</Text>
          </View>
          <Text style={styles.modalDescription}>
            Nötter som jordnötter, mandlar, valnötter och cashewnötter är en vanlig allergen. De kan finnas i olika livsmedelsprodukter, inklusive snacks, desserter och såser.
          </Text>
        </View>
        <View>
          <View style={styles.symbolHeader}>
            <View key={'seafood'} style={styles.greenIconContainer}>
              <MaterialCommunityIcons name="fish" size={15} color="white" />
            </View>
            <Text style={styles.modalTitle}>- Skaldjur</Text>
          </View>
          <Text style={styles.modalDescription}>
            Skaldjursallergier är vanligtvis förknippade med fisk (som lax, tonfisk och torsk) och skaldjur (som räkor, hummer och krabba). Allergiska reaktioner kan variera från milda till allvarliga.
          </Text>
        </View>
        <View>
          <View style={styles.symbolHeader}>
            <View key={'vegetarian'} style={styles.greenIconContainer}>
              <MaterialCommunityIcons name="leaf" size={15} color="white" />
            </View>
            <Text style={styles.modalTitle}>- Vegetarisk</Text>
          </View>
          <Text style={styles.modalDescription}>
            Vegetarianism innebär att avstå från att konsumera kött, fjäderfä och skaldjur. Vegetarianer kan fortfarande konsumera mejeriprodukter och ägg.
          </Text>
        </View>
        <View>
          <View style={styles.symbolHeader}>
            <View key={'vegan'} style={styles.greenIconContainer}>
              <MaterialCommunityIcons name="sprout" size={15} color="white" />
            </View>
            <Text style={styles.modalTitle}>- Vegansk</Text>
          </View>
          <Text style={styles.modalDescription}>
            Vegansk kost utesluter alla animaliska produkter, inklusive kött, fjäderfä, skaldjur, mejeriprodukter och ägg. Det är också en livsstil som undviker användning av alla animaliska produkter.
          </Text>
        </View>
        <View>
          <View style={styles.symbolHeader}>
            <View key={'vegan'} style={styles.greenIconContainer}>
              <MaterialCommunityIcons name="cube-outline" size={15} color="white" />
            </View>
            <Text style={styles.modalTitle}>- Socker</Text>
          </View>
          <Text style={styles.modalDescription}>
          Socker är en vanlig ingrediens i många livsmedel och drycker. Att vara medveten om din sockerkonsumtion kan vara viktigt för din hälsa. Överdriven sockerkonsumtion har kopplats till flera hälsoproblem, inklusive fetma, typ 2-diabetes och hjärt-kärlsjukdomar.
          </Text>
        </View>
        <View>
          <View style={styles.symbolHeader}>
            <View key={'vegan'} style={styles.greenIconContainer}>
              <MaterialCommunityIcons name="food-steak" size={15} color="white" />
            </View>
            <Text style={styles.modalTitle}>- Keto</Text>
          </View>
          <Text style={styles.modalDescription}>
          Ketogen diet, eller keto, är en lågkolhydratdiet som syftar till att få kroppen att producera ketoner i levern för energi istället för att använda glukos. Detta uppnås genom att minska kolhydratintaget avsevärt.
          </Text>
        </View>
        <View>
          <View style={styles.symbolHeader}>
            <View key={'vegan'} style={styles.greenIconContainer}>
              <MaterialCommunityIcons name="egg" size={15} color="white" />
            </View>
            <Text style={styles.modalTitle}>- Ägg</Text>
          </View>
          <Text style={styles.modalDescription}>
          Ägg är en vanlig allergen och kan orsaka allergiska reaktioner hos vissa individer. Äggallergi innebär att kroppens immunsystem reagerar på äggproteiner som främmande ämnen och utlöser allergiska symtom.
          </Text>
        </View>
        <TouchableOpacity onPress={() => setShowInfo(false)} style={styles.closeButton}>
          <Text style={styles.closeButtonText}>Stäng</Text>
        </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  </Modal>
)}

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
      },
      modalContent: {
        backgroundColor: '#FFF',
        padding: 20,
        borderRadius: 10,
        width: '90%',
      },
      modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        marginLeft: 5
      },
      modalDescription: {
        fontSize: 14,
      },
      closeButton: {
        backgroundColor: '#333',
        padding: 10,
        borderRadius: 5,
        marginTop: 20,
        alignSelf: 'flex-end',
      },
      closeButtonText: {
        color: '#FFF',
        fontWeight: 'bold',
      },
      symbolHeader: {
        flexDirection: 'row',
        marginTop: 10
      },
      label: {
        fontSize: 20,
        fontWeight: 'bold',
        paddingLeft: 10,
        paddingBottom: 5,
        borderBottomWidth: 1
      },
      greenIconContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: "center",
        backgroundColor: 'green',
        borderRadius: 50,
        marginLeft: 3,
        marginTop: 3,
        height: 20,
        width: 20
      },
      redIconContainer:  {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: "center",
        backgroundColor: 'red',
        borderRadius: 50,
        marginLeft: 3,
        marginTop: 3,
        height: 20,
        width: 20
      },
      yellowIconContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: "center",
        backgroundColor: '#ffd343',
        borderRadius: 50,
        marginLeft: 3,
        marginTop: 3,
        height: 20,
        width: 20
      },
      greyIconContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: "center",
        backgroundColor: 'grey',
        borderRadius: 50,
        marginLeft: 3,
        marginTop: 3,
        height: 20,
        width: 20
      },
      sectionContainer: {
        marginTop: 30
      },
      redText: {
        color: 'red',
        fontWeight: 600
      },
      verified: {
        paddingTop: 5
      }
})