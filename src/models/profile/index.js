class Profile{
    constructor(name, education, experience, contactInfo){
        this.name = name,
        this.educations = educations,
        this.experiences = experiences,
        this.contactInfo = contactInfo
    }
}



class Education extends InfoItem{
    constructor(title, institution, starDate, endDate){
        super(title, institution, starDate, endDate)
    }
}

class Experience extends InfoItem{
    constructor(title, institution, starDate, endDate){
        super(title, institution, starDate, endDate)
    }
}

export default Profile;