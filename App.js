import React,{useState} from 'react';
import Realm from "realm";
import type {Node} from 'react';
import {useApp,createRealmContext} from '@realm/react';
import {AppProvider, UserProvider, useUser} from '@realm/react';

import {
  Button,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Alert,
  TextInput
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';


const userSchema = {
  name: "users",
  primaryKey: '_id',
  properties: {
    __v:  "int?",
    _id:"objectId?",
    createdAt: "date?",
    device_token:"string?",
    device_type:"string?",
    email:"string?",
    ever_logged_in:"bool?",
    firstname:"string?",
    isLoggedin:"bool?",
    lastname:"string?",
    login_type:"string?",
    password:  "string?",
    phone:  "string?",
    relationship:"string?",
    social_id:  "string?",
    status: "string?"
  },
}


let user;
const ATLAS_SERVICE = 'mongodb-atlas';
const app = new Realm.App({id: 'test-eyyda'});

async function anonymousLogin() {
  let user;
  try {
    const app = new Realm.App({id: 'test-eyyda'}); // pass in the appConfig variable that you created earlier
    const credentials = Realm.Credentials.anonymous(); // create an anonymous credential
    user = await app.logIn(credentials);
    console.log(user);
    return user;
  } catch (error) {
      throw `Error logging in anonymously: ${JSON.stringify(error,null,2)}`;
  }
}

const Section = ({children, title}): Node => {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
};


const login = async (email,password) => {
  
  const credentials = Realm.Credentials.emailPassword(email, password);
  try {
    user = await app.logIn(credentials);
    console.log(app.currentUser,user.id);
  } catch (err) {
    console.error("Failed to log in", err);
  }
};

const logout = async () => {
  
  const userId = app.currentUser.id;
  await app.allUsers[userId].logOut();
  console.log(app.currentUser);
  let email_div = $("#user-emails");
  email_div.empty();
  let realm_BE_firstname = $("#realm-BE-firstname");
  realm_BE_firstname.empty();
  $('#user').empty();
  localStorage.clear();
};

// const realm = await Realm.open(
//   schema: [userSchema],
//   sync: {user, flexible:true},
// );

 

const getUsersRealmFunction = async () => {
  // console.log(user.id);
  try {
    const result = await user.functions.getUsers();
    const get2 = result.slice(0,2);
    console.log(result);
    // let email_div = $("#user-emails");
    // let realm_BE_firstname = $("#realm-BE-firstname");
    // realm_BE_firstname.empty();
    // email_div.empty();
    // for (const user of get20) {
    //   let p = document.createElement("p");
    //   p.append(user.firstname);
    //   realm_BE_firstname.append(p);
    }catch (error) {
    // $("#user").append("Need to login first.");
    console.error("Need to log in first", error);
    return;
  }
}

const openRealm = async () => {
  console.log('openRealm clicked');
  try {
    const realm = await Realm.open({
      schema: [userSchema],
      sync: {
        user: app.currentUser,
        flexible: true,
      },
    });

    console.log('realm',realm, realm.subscriptions);

    // await realm.subscriptions.update((mutableSubscriptions) => {
    //   mutableSubscriptions.add(
    //     realm
    //       .objects(userSchema.name)
    //       // .filtered("location = 'dallas' && price < 300000 && bedrooms = 3", {
    //       //   name: "home-search",
    //       // })
    //   );
    // });

    let x = realm.objects("users");
    console.log(x);
    realm.close();
  } catch (err) {
    console.error("Failed to open the realm", err.message);
  }
}

const test1 = async () => {
  try {
    console.log(app.currentUser.id);
    const config = {
      sync: {
        user: app.currentUser,
        flexible: true,
        initialSubscriptions: {
          update: (subs, realm) => {
            subs.add(
              realm.objects("users")
              // .filtered("name == 'Developer Education'")
            );
          },
        },
      },
    };
    const realm = await Realm.open(config);
    // const realm = await Realm.open({
    //   schema: [userSchema],
    //   sync: {
    //     user: app.currentUser,
    //     flexible: true,
    //     initialSubscriptions: {
    //       update: (subs, realm) => {
    //         // subscribe to all of the logged in user's to-do items
    //         subs.add(realm.objects('users'));
    //       },
    //     }  
    //   },
    // });

    await realm.subscriptions.update((mutableSubscriptions) => {
      mutableSubscriptions.add(
        realm.objects('users'),
        // {
        //   name: "users",
        //   throwOnUpdate: true,
        // }
        )
    });

    console.log(realm.subscriptions.state);

    let myusers = await realm.objects("users"); 
    console.log('users',myusers);

    console.log(realm.subscriptions);


    // const subscriptions = realm.subscriptions;
    // console.log(subscriptions);

    

    

    realm.write(() => {
        
        realm.delete(realm.objects("users"));
        
        
      });
      myusers = await realm.objects("users"); 
      console.log('emptyusers',myusers);
    
    let datas1;
    realm.write(() => {
        datas1 = realm.create("users", { firstname: "Masffdx", email: "tessfdft@gamils.com"  });
      });
    myusers = await realm.objects("users"); 
    console.log('users',myusers);

    // await realm.subscriptions.update((mutableSubs) => {
    //   mutableSubs.add(myusers, {
    //     name: "myusersSubs",
    //     throwOnUpdate: true
    //   })
    // });  


    // // console.log(y, realm.subscriptions);
    // });  


    // realm.write(() => {
    //   datas1 = realm.create("users", { firstname: "Masfdx", email: "tessdft@gamils.com" });
    // });
    // const myusers = await realm.objects("users"); 
    // console.log(myusers);



  } catch (error) {
    console.log(error);
  }

}


const test = async () => {
  console.log(app.currentUser.id);
  try {
    const realm = await Realm.open({
      schema: [userSchema],
      sync: {
        user: app.currentUser,
        flexible: true,
        initialSubscriptions: {
          update: (subs, realm) => {
            // subscribe to all of the logged in user's to-do items
            subs.add(realm.objects('users'));
          },
        }  
      },
    });

    
    let myusers = await realm.objects("users");
    console.log(myusers);
    
    
    // console.log(realm.subscriptions);

    realm.write(() => {
      realm.delete(realm.objects("users"));
    });

    myusers = await realm.objects("users"); 
    console.log('emptyusers',myusers);
        
    let datas1;
    realm.write(() => {
        datas1 = realm.create("users", { firstname: "Masffdx", email: "tessfdft@gamils.com"  });
      });
    myusers = await realm.objects("users"); 
    console.log('users',myusers);

    // await realm.subscriptions.update((mutableSubscriptions) => {
    //   mutableSubscriptions.add(
    //     realm.objects('test.users'),
    //     {
    //         name: "users",
    //         throwOnUpdate: true,
    //       }
    //       )
    // });
    console.log(realm.subscriptions);
    console.log(realm.subscriptions.state);

  } catch (error) {
    console.log(error);
  }
}


const App: () => Node = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  // const app = useApp();

  const data = () =>{
    console.log('data');
    Alert.prompt('Enter email',[
      {
        text:"Submit",
        onPress:((text)=>setEmail(text))
      }
    ],"plain-text","email")
    console.log(email);
  }

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <View>
          <TextInput
            style={{height: 40}}
            placeholder="email"
            onChangeText={newText => setEmail(newText)}
            defaultValue={email}
          />
          <TextInput
            style={{height: 40}}
            placeholder="password"
            onChangeText={newText => setPassword(newText)}
            defaultValue={password}
          />
          <Button
            title="Login"
            // onPress={() => Alert.alert('Simple Button pressed')}
            onPress={() => {
              login(email,password)
            }}
          />
          <Button
            title="logUsers"
            // onPress={() => Alert.alert('Simple Button pressed')}
            onPress={() => {
              getUsersRealmFunction()
            }}
          />
          <Button
            title="openRealm"
            // onPress={() => Alert.alert('Simple Button pressed')}
            onPress={() => {
              openRealm()
            }}
          />
           <Button
            title="test"
            // onPress={() => Alert.alert('Simple Button pressed')}
            onPress={() => {
              test()
            }}
          />
          
        </View>  
        {/* <Header /> */}
        {/* <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <Section title="Step">
            Edit <Text style={styles.highlight}>App.js</Text> to change this
            screen and then come back to see your edisfdts.
          </Section>
          <Section title="See Your changes">
            <ReloadInstructions />
          </Section>
          <Section title="Debug">
            <DebugInstructions />
          </Section>
          <Section title="Learn More">
            Read the docs to discover what to do next:
          </Section>
          <LearnMoreLinks />
        </View> */}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

// export default App;
export default App;
