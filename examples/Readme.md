If you want to import a person into the group that we have for the FACE recognition demo you can use the file [importAndIdentify](importAndIdentify.js) with the correct credentials.

You can see the KEYS that you need in the demo (by inspecting the code) in the page [https://test.elitechnology.com/facedemo/](https://test.elitechnology.com/facedemo/)  

To add the files, since they need to be something that can be served via a URL, the best is to serve them with your favorite STATIC server let's say PYTHON simpleHTTPServer or with express
and then have them tunneled with NGROK, so that Azure is able to access the picture from that person.

It should look something similar to this.

```js
// NOTE: We are going to be using the same person group across the whole demo 20190515:Alevale

const FaceApiTranslator = require('../index')

// NOTE: We are going to make the setup of the faces and people here, just as an example 20190516:Alevale
const people = [
    {
        name: 'SOMEONE',
        userData: {
            email: 'SOMEONE@cxcompany.com',
            username: 'SOMEONE'
        },
        pictures: [
            'https://t-dialog-development-1.eu.ngrok.io/picture1.jpg',
            'https://t-dialog-development-1.eu.ngrok.io/picture2.jpg',
            'https://t-dialog-development-1.eu.ngrok.io/picture3.jpg',
            'https://t-dialog-development-1.eu.ngrok.io/picture4.jpg',
            'https://t-dialog-development-1.eu.ngrok.io/picture5.jpg'
        ],
        testPicture: 'https://t-dialog-development-1.eu.ngrok.io/picture1.jpg'
    }
]

const waitFor = (time) => {
    return new Promise((resolve, reject) => {
        return setTimeout(resolve, time)
    })
}

const importPeopleAndIdentifyThem = async (people) => {

    const {
        subscriptionKey,
        personGroupId
    } = {
        subscriptionKey: 'GET THIS FROM THE DEMO PAGE IN THE LINK PROVIDED',
        personGroupId: 'GET THIS FROM THE DEMO PAGE IN THE LINK PROVIDED'
    }

    try {

        const faceApi = new FaceApiTranslator({
            subscriptionKey,
            personGroupId
        })

        // NOTE: Iterate through the passed people 20190515:Alevale
        for (person of people) {

            // NOTE: Create a new person 20190515:Alevale
            const { data: { personId } } = await faceApi.createNewPerson({
                name: person.name,
                userData: person.userData
            })


            for (picture of person.pictures) {
                await waitFor(1000)
                console.log('adding image of', person.name)
                // NOTE: Add some pictures to that person 20190515:Alevale
                faceApi.addImageToPerson({
                    personId,
                    faceUrl: picture
                })
            }

        }

        // NOTE: After adding some pictures train the models 20190515:Alevale
        faceApi.trainPersonGroup({})

        // NOTE: Wait till the model is trained 20190515:Alevale
        let finishedTraining = false
        while (!finishedTraining) {
            await waitFor(1000)
            const { data: status } = await faceApi.getTrainingStatus({})
            console.log('still training, status', status)
            finishedTraining = status.status === 'succeeded'
        }

        // NOTE: Iterate through the passed people 20190515:Alevale
        for (person of people) {

            // NOTE: Detect a face 20190515:Alevale
            const { data: [{ faceId }] } = await faceApi.detectAFace({
                faceUrl: person.testPicture
            })

            // NOTE: Identify a face 20190515:Alevale
            const { data: [{ candidates }] } = await faceApi.identifyAPicture(undefined, {
                    faceIds: faceId
                }
            )

            for (candidate of candidates) {
                const { data } = await faceApi.getPersonDetails({
                    personId: candidate.personId
                })
                console.log()
                console.log('recognised', data)
                console.log('Person passed was', person.name)
                console.log()
            }
        }


    } catch (e) {
        console.log(e)
    }
}

importPeopleAndIdentifyThem(people)
```
