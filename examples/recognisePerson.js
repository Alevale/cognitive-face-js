const recognisePerson = async (faceUrl) => {
    const {
        subscriptionKey,
        personGroupId
    } = {
        subscriptionKey: 'XXXXXXXXXXXXXXXX',
        personGroupId: 'group_to_search_the_person_in'
    }

    const faceApi = new FaceApiTranslator({
        subscriptionKey,
        personGroupId
    })

    // NOTE: Detect a face 20190515:Alevale
    const { data: [{ faceId }] } = await faceApi.detectAFace({
        faceUrl,
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
        console.log()
        console.log(data)
    }
}

recognisePerson('http://example.com/picture.jpg')
